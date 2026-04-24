const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = parseInt(process.env.MAX_PLAYERS || "8", 10);

let cache = {
  mode: "push",
  online: true,
  visualOnline: true,
  name: "BRILL LOGISTICS",
  players: 0,
  maxPlayers: MAX_PLAYERS,
  load: 0,
  map: "ETS2",
  updatedAt: new Date().toISOString()
};

app.get("/", (req, res) => {
  res.send("BRILL PUSH MONITOR WORKS");
});

app.get("/status", (req, res) => {
  res.json(cache);
});

app.get("/push", (req, res) => {
  const players = parseInt(req.query.players || "0", 10);
  const safePlayers = Math.max(0, Math.min(players, MAX_PLAYERS));

  cache = {
    mode: "push",
    online: true,
    visualOnline: true,
    name: "BRILL LOGISTICS",
    players: safePlayers,
    maxPlayers: MAX_PLAYERS,
    load: Math.round((safePlayers / MAX_PLAYERS) * 100),
    map: "ETS2",
    updatedAt: new Date().toISOString()
  };

  res.json({
    ok: true,
    players: safePlayers
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("BRILL PUSH MONITOR started on port " + PORT);
});
