const express = require("express");
const cors = require("cors");
const gamedig = require("gamedig");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const SERVER_HOST = process.env.SERVER_HOST || "brill-rp-ets2.nodecraft.gg";
const SERVER_PORTS = (process.env.SERVER_PORTS || "27016,27015")
  .split(",")
  .map(p => parseInt(p.trim(), 10))
  .filter(Boolean);

const MAX_PLAYERS = parseInt(process.env.MAX_PLAYERS, 10) || 8;

let cache = {
  mode: "starting",
  online: false,
  visualOnline: true,
  name: "BRILL LOGISTICS",
  players: 1,
  maxPlayers: MAX_PLAYERS,
  map: "ETS2",
  ping: 42,
  load: 12,
  updatedAt: new Date().toISOString()
};

app.get("/", (req, res) => {
  res.send("BRILL LOGISTICS API is running");
});

app.get("/status", (req, res) => {
  res.json(cache);
});

async function updateStatus() {
  for (const port of SERVER_PORTS) {
    try {
      const state = await gamedig.query({
        type: "protocol-valve",
        host: SERVER_HOST,
        port,
        socketTimeout: 5000,
        maxAttempts: 1
      });

      const players = state.players ? state.players.length : 0;
      const maxPlayers = state.maxplayers || MAX_PLAYERS;

      cache = {
        mode: "real",
        online: true,
        visualOnline: true,
        name: state.name || "BRILL LOGISTICS",
        players,
        maxPlayers,
        map: state.map || "ETS2",
        ping: state.ping || 42,
        load: Math.round((players / maxPlayers) * 100),
        updatedAt: new Date().toISOString()
      };

      return;
    } catch (e) {}
  }

  const minute = new Date().getMinutes();
  const fakePlayers = Math.max(1, Math.floor((minute / 60) * MAX_PLAYERS));

  cache = {
    mode: "visual",
    online: false,
    visualOnline: true,
    name: "BRILL LOGISTICS",
    players: fakePlayers,
    maxPlayers: MAX_PLAYERS,
    map: "ETS2",
    ping: 42,
    load: Math.round((fakePlayers / MAX_PLAYERS) * 100),
    updatedAt: new Date().toISOString()
  };
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`BRILL API started on port ${PORT}`);
  updateStatus();
  setInterval(updateStatus, 30000);
});
