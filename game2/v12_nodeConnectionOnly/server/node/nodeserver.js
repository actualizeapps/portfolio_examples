import http from "http";

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

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, received: "successful insert" }));
      });
  }

  if (req.url.startsWith("/get_leaderboard") && req.method === "GET") {
    console.log("Getting leaderboard");

    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      console.log("Raw body:", body);
      // Parse x-www-form-urlencoded string into an object
      const data = [
        {
        "name": "John",
        "score": 100,
        "time": "1762301347941",
        "gameType": "Dots Unique",
        "dataStructure": "DynamicArray"
        }
      ];
  
      console.log("Parsed data:", data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
      });
  }

  
});

server.listen(3000, () => console.log("Node queue server listening on 3000"));