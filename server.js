const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("BRILL API WORKS");
});

app.get("/status", (req, res) => {
  res.json({
    online: true,
    visualOnline: true,
    mode: "test",
    name: "BRILL LOGISTICS",
    players: 3,
    maxPlayers: 8,
    load: 38,
    map: "ETS2",
    ping: 42
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port " + PORT);
});
