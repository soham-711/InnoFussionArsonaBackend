// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./db/connectDB");
// const sensorRoutes = require("./routes/sensorRoutes");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/sensor", sensorRoutes);

// // Connect DB & Start Server
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// });

// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./db/connectDB");
// const sensorRoutes = require("./routes/sensorRoutes");
// const SensorData = require("./models/SensorData"); // ✅ Add this line
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/sensor", sensorRoutes);

// // 🧹 Auto-delete old sensor data every 5 seconds
// setInterval(async () => {
//   const cutoff = new Date(Date.now() - 10000); // 10 seconds ago
//   try {
//     const result = await SensorData.deleteMany({ timestamp: { $lt: cutoff } });
//     console.log(`🧹 Deleted ${result.deletedCount} old sensor data records.`);
//   } catch (error) {
//     console.error("❌ Failed to delete old sensor data:", error);
//   }
// }, 5000);

// // Connect DB & Start Server
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// });

const notificationRoutes = require("./routes/notificationRoutes");
const express = require("express");
const http = require("http"); // 🔁 Required for socket.io
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./db/connectDB");
const sensorRoutes = require("./routes/sensorRoutes");
const SensorData = require("./models/SensorData");
require("dotenv").config();
const { setSocketInstance } = require("./controllers/sensorController");

const app = express();
const server = http.createServer(app); // 🌐 Use HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow Expo app to connect
    methods: ["GET", "POST"],
  },
});
setSocketInstance(io);

// 🌐 Real-time Socket.IO connection
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("⚡ Client disconnected:", socket.id);
  });
});

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Pass io instance to routes via req.app.get("io")
app.set("io", io);

// Routes
app.use("/api/sensor", sensorRoutes);
app.use("/api/notifications", notificationRoutes);

// 🧹 Auto-delete old sensor data every 5 seconds
setInterval(async () => {
  const cutoff = new Date(Date.now() - 10000); // 10 seconds ago
  try {
    const result = await SensorData.deleteMany({ timestamp: { $lt: cutoff } });
    console.log(`🧹 Deleted ${result.deletedCount} old sensor data records.`);
  } catch (error) {
    console.error("❌ Failed to delete old sensor data:", error);
  }
}, 5000);

// ✅ Connect DB & Start Server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
