const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = parseInt(process.env.MAX_PLAYERS || "8", 10);

// ВАЖНО: если Railway не имеет доступа к логам Nodecraft,
// этот код надо запускать там, где лежит лог ETS2.
const LOG_FILE = process.env.LOG_FILE || "/home/container/.local/share/Euro Truck Simulator 2/game.log.txt";

function getStatusFromLog() {
  try {
    const log = fs.readFileSync(LOG_FILE, "utf8");

    const matches = [...log.matchAll(/State:\s*running;\s*Time:\s*\d+;\s*Players:\s*(\d+)/g)];
    const last = matches[matches.length - 1];

    const players = last ? parseInt(last[1], 10) : 0;

    return {
      mode: "logs",
      online: true,
      visualOnline: true,
      name: "BRILL LOGISTICS",
      players: players,
      maxPlayers: MAX_PLAYERS,
      load: Math.round((players / MAX_PLAYERS) * 100),
      map: "ETS2 Europe",
      updatedAt: new Date().toISOString()
    };
  } catch (e) {
    return {
      mode: "logs-error",
      online: false,
      visualOnline: false,
      name: "BRILL LOGISTICS",
      players: 0,
      maxPlayers: MAX_PLAYERS,
      load: 0,
      map: "ETS2",
      error: e.message,
      updatedAt: new Date().toISOString()
    };
  }
}

app.get("/", (req, res) => {
  res.send("BRILL LOG MONITOR WORKS");
});

app.get("/status", (req, res) => {
  res.json(getStatusFromLog());
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("BRILL log monitor started on port " + PORT);
});
