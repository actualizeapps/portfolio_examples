import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const leaderboardFile = path.join(__dirname, "leaderboard_db.txt");

// Global variables to store the loaded data, make the compare function sort descending
let allTimeData = []

// Function to load and index the leaderboard
function loadLeaderboard() {
  console.log("Loading leaderboard from file...");
  try {
    const fileContent = fs.readFileSync(leaderboardFile, 'utf8');
    const entries = JSON.parse(fileContent);
    for (const entry of entries) {
      allTimeData.push(entry);
    }
    console.log(`Loaded ${allTimeData.length} entries`);

  } catch (err) {
    console.error("Error loading leaderboard:", err);
  }
}

// Load the leaderboard when server starts
loadLeaderboard();

const server = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log("Server started");

  if (req.url === "/insert_leaderboard_entry" && req.method === "POST") {
    console.log("inserting leaderboard entry");

    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      console.log("Raw body:", body);

      try {
        // Parse the incoming entry (assuming JSON or URL-encoded)
        let newEntry;
        // URL-encoded format
        const params = new URLSearchParams(body);
        newEntry = {
          name: params.get('name'),
          score: parseInt(params.get('score'), 10),
          time: parseInt(params.get('time'), 10),
          gameType: params.get('gameType'),
          dataStructure: params.get('dataStructure')
        };

        //console.log("Parsed entry:", newEntry);

        // Insert into sorted leaderboardArray at correct position
        const insertIndex = binarySearchInsertPosition(allTimeData, newEntry);
        allTimeData.splice(insertIndex, 0, newEntry);

        // Write entire array back to file
        fs.writeFileSync(leaderboardFile, JSON.stringify(allTimeData, null, 4), 'utf8');

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

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(allTimeData));
  }

});


server.listen(3000, () => console.log("Node queue server listening on 3000"));

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
