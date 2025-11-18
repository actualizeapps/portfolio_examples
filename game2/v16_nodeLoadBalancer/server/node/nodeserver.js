import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const leaderboardFile = path.join(__dirname, "leaderboard_db.txt");
let writeTimer = null;
const WRITE_DELAY = 100; 
const MAX_WRITE_INTERVAL = 2000; // force a write every 2s even under load
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
let lastWriteTime = 0;
let daySorted = [];
let weekSorted = [];
let monthSorted = [];
let allTimeData = [];

// Load the leaderboard when server starts
loadLeaderboard();

console.log("Server started");

const port = process.argv[2];


const server = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");


  if (req.url === "/insert_leaderboard_entry" && req.method === "POST") {
    console.log("inserting leaderboard entry");

    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {

      try {
        // Parse the incoming entry (assuming JSON or URL-encoded)
        // URL-encoded format
        const params = new URLSearchParams(body);
        let newEntry = {
          name: params.get('name'),
          score: parseInt(params.get('score'), 10),
          time: parseInt(params.get('time'), 10),
          gameType: params.get('gameType'),
          dataStructure: params.get('dataStructure')
        };

        let aggregateEntry = {
          name: newEntry.name,
          score: newEntry.score
        };

        // Insert into sorted allTimeIndex at correct position using binary search
        const insertIndex = binarySearchInsertPosition(allTimeData, newEntry);
        allTimeData.splice(insertIndex, 0, newEntry);

        // Write entire array back to max every 100ms to rate limit.
        scheduleLeaderboardWrite();

        if (newEntry.time >= Date.now() - DAY_IN_MS) {
          upsertAggregate(daySorted, aggregateEntry);
        }
        // Update the dateScoreIndex for this date
        if (newEntry.time >= Date.now() - WEEK_IN_MS) {
          upsertAggregate(weekSorted, aggregateEntry);
        }

        if (newEntry.time >= Date.now() - MONTH_IN_MS) {
          upsertAggregate(monthSorted, aggregateEntry);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Entry inserted successfully" }));

      } catch (err) {
        console.error("Insert error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
  }


  if (req.url.startsWith("/get_leaderboard") && req.method === "GET") {
    console.log("Getting leaderboard");

    // Parse URL query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const endDate = url.searchParams.get('endDate');
    
    console.log("endDate param:", endDate);

    // If endDate exists, filter by date range
    let resultData = [];
    
    if (endDate) {
      const endTimestamp = parseInt(endDate);
      if (endTimestamp >= Date.now() - DAY_IN_MS) {
        resultData = daySorted;
      } else if (endTimestamp >= Date.now() - WEEK_IN_MS) {
        resultData = weekSorted;
      } else {
        resultData = monthSorted;
      }
      console.log(`Returning ${resultData.length} entries`);
    } else {
      console.log(`Returning ${allTimeData.length} entries`);
      // No endDate provided, return all entries
      resultData = allTimeData;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(resultData));
  }

});

server.listen(port, () => console.log("Node queue server listening on port " + port));

// ---- FUNCTIONS ---
function upsertAggregate(sortedArr, aggregateEntry) {
  let nameExists = false;

  for (let i = 0; i < sortedArr.length; i++) {
    if (sortedArr[i].name === aggregateEntry.name) {
      nameExists = true;
      sortedArr[i].score += aggregateEntry.score;
      let currScore = sortedArr[i].score;

      // bubble up (descending order: higher scores first)
      while (i > 0 && currScore > sortedArr[i - 1].score) {
        const temp = sortedArr[i];
        sortedArr[i] = sortedArr[i - 1];
        sortedArr[i - 1] = temp;
        i--;
      }
      break;
    }
  }

  // if name doesnt exist, just insert.
  if (!nameExists) {
    const insertIndex = binarySearchInsertPosition(sortedArr, aggregateEntry);
    sortedArr.splice(insertIndex, 0, aggregateEntry);
  }
}

// Binary search to find insert position for descending order
function binarySearchInsertPosition(arr, element) {
  let left = 0;
  let right = arr.length;
  const score = parseInt(element.score);
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const midScore = parseInt(arr[mid].score);
    
    // For descending order: if midScore > score, search right half
    if (midScore > score) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left;
}

function scheduleLeaderboardWrite() {
  const now = Date.now();

  // Clear existing timer
  if (writeTimer) clearTimeout(writeTimer);

  // If it's been too long since the last actual write, flush soon
  const timeSinceLastWrite = now - lastWriteTime;
  const delay = timeSinceLastWrite >= MAX_WRITE_INTERVAL
      ? 0
      : WRITE_DELAY;

  writeTimer = setTimeout(() => {
      writeTimer = null;
      lastWriteTime = Date.now();
      console.log("Writing leaderboard to file");

      fs.writeFile(
          leaderboardFile,
          JSON.stringify(allTimeData, null, 4),
          'utf8',
          (err) => {
              if (err) console.error('Error writing leaderboard:', err);
          }
      );
  }, delay);
}

// Function to load and index the leaderboard
function loadLeaderboard() {
  console.log("Loading leaderboard from file...");
  let dayAccumulatedScores = new Map();
  let weekAccumulatedScores = new Map();
  let monthAccumulatedScores = new Map();

  try {
    const fileContent = fs.readFileSync(leaderboardFile, 'utf8');
    const entries = JSON.parse(fileContent);
    allTimeData = [];
    
    for (const entry of entries) {
      let leaderboardStruct = convertToLeaderboardStruct(entry);
      allTimeData.push(leaderboardStruct);

      if (entry.time >= Date.now() - DAY_IN_MS) {
        dayAccumulatedScores.set(leaderboardStruct.name, (dayAccumulatedScores.get(leaderboardStruct.name) || 0) + leaderboardStruct.score);
      }
      // name, score
      if (entry.time >= Date.now() - WEEK_IN_MS) {
        weekAccumulatedScores.set(leaderboardStruct.name, (weekAccumulatedScores.get(leaderboardStruct.name) || 0) + leaderboardStruct.score);
      }

      if (entry.time >= Date.now() - MONTH_IN_MS) {
        monthAccumulatedScores.set(leaderboardStruct.name, (monthAccumulatedScores.get(leaderboardStruct.name) || 0) + leaderboardStruct.score);
      }

    }

    daySorted = Array.from(dayAccumulatedScores, ([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score);

    weekSorted = Array.from(weekAccumulatedScores, ([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score);

    monthSorted = Array.from(monthAccumulatedScores, ([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score);

    console.log(`Loaded ${allTimeData.length} entries`);
    
  } catch (err) {
    console.error("Error loading leaderboard:", err);
  }

  function convertToLeaderboardStruct(entry) {
    return {
      name: entry.name,
      score: parseInt(entry.score, 10),
      time: parseInt(entry.time, 10),
      gameType: entry.gameType,
      dataStructure: entry.dataStructure
    };
  }
}
