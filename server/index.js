const express = require("express");
const cors = require("cors");
const http = require("http");
const marketSocket = require("./websocket/marketSocket");
const marketRoutes = require("./routes/marketRoutes");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/market", marketRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Trading API is running",
  });
});

const server = http.createServer(app);
marketSocket(server);

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
