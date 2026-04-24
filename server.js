const express = require("express");
const cors = require("cors");
const { GameDig } = require("gamedig");

const app = express();

app.use(cors());

const SERVER_HOST = "brill-rp-ets2.nodecraft.gg";
const QUERY_PORTS = [27016, 27015];
const DEFAULT_MAX_PLAYERS = 8;

let visualOnline = true;

let cache = {
  mode: "loading",
  online: false,
  visualOnline: true,
  name: "BRILL LOGISTICS",
  players: 0,
  maxPlayers: DEFAULT_MAX_PLAYERS,
  map: "ETS2",
  ping: null,
  load: 0,
  updatedAt: new Date().toISOString()
};

async function queryPort(port) {
  return await GameDig.query({
    type: "protocol-valve",
    host: SERVER_HOST,
    port,
    maxAttempts: 2,
    socketTimeout: 5000
  });
}

async function updateStatus() {
  for (const port of QUERY_PORTS) {
    try {
      const state = await queryPort(port);

      const players = state.players ? state.players.length : 0;
      const maxPlayers = state.maxplayers || DEFAULT_MAX_PLAYERS;
      const load = maxPlayers > 0 ? Math.round((players / maxPlayers) * 100) : 0;

      cache = {
        mode: "real",
        online: true,
        visualOnline: true,
        name: state.name || "BRILL LOGISTICS",
        players,
        maxPlayers,
        map: state.map || "ETS2",
        ping: state.ping || null,
        load,
        port,
        updatedAt: new Date().toISOString()
      };

      return;
    } catch (e) {}
  }

  // Если реальный query не ответил — включаем AAA fallback
  const hour = new Date().getHours();
  const simulatedPlayers = visualOnline ? Math.max(1, (hour % DEFAULT_MAX_PLAYERS)) : 0;
  const load = Math.round((simulatedPlayers / DEFAULT_MAX_PLAYERS) * 100);

  cache = {
    mode: "visual",
    online: false,
    visualOnline,
    name: "BRILL LOGISTICS",
    players: simulatedPlayers,
    maxPlayers: DEFAULT_MAX_PLAYERS,
    map: "ETS2",
    ping: visualOnline ? 42 : null,
    load,
    port: null,
    updatedAt: new Date().toISOString()
  };
}

updateStatus();
setInterval(updateStatus, 30000);

app.get("/", (req, res) => {
  res.send("BRILL LOGISTICS AAA Monitoring API is running");
});

app.get("/status", (req, res) => {
  res.json(cache);
});

app.get("/visual/on", (req, res) => {
  visualOnline = true;
  updateStatus();
  res.json({ ok: true, visualOnline });
});

app.get("/visual/off", (req, res) => {
  visualOnline = false;
  updateStatus();
  res.json({ ok: true, visualOnline });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BRILL AAA Monitoring API started on port ${PORT}`);
});
