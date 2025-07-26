// controllers/sensorController.js
const { log } = require("console");
const SensorData = require("../models/SensorData");
const Notification = require("../models/notification");

// exports.receiveSensorData = async (req, res) => {
//   try {
//     const { gas, flame, temperature, botId, flag } = req.body;
//     console.log(gas, flame, temperature, botId, flag);

//     // ✅ Save all incoming sensor data
//     const newData = new SensorData({ gas, flame, temperature, botId });
//     await newData.save();
//     console.log("📡 Sensor data saved:", newData);

//     // ⚠️ Create notification only if flag is not 'safe'
//     if (flag !== "safe") {
//       const newNotification = new Notification({
//         botId,
//         message: `🚨 Alert: ${flag} detected!`,
//         gas,
//         flame,
//         temperature,
//         flag,
//       });
//       await newNotification.save();
//       console.log("🔔 Notification saved:", newNotification);
//     } else {
//       console.log("✅ Flag is safe. No notification stored.");
//     }

//     res
//       .status(201)
//       .json({ success: true, message: "Sensor data processed successfully" });
//   } catch (err) {
//     console.error("❌ Error handling sensor data:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };



let io; // Socket.IO instance injected from server

// Setter to receive Socket.IO instance
exports.setSocketInstance = (socketInstance) => {
  io = socketInstance;
};

exports.receiveSensorData = async (req, res) => {
  try {
    const { gas, flame, temperature, botId, flag } = req.body;
    console.log("📥 Incoming Sensor Data:", gas, flame, temperature, botId, flag);

    // ✅ Save all sensor data
    const newData = new SensorData({ gas, flame, temperature, botId });
    await newData.save();
   
    console.log(newData);
    

    // 🔄 Emit real-time update to frontend via Socket.IO
    if (io) {
      io.emit("new-sensor-data", newData); // 👈 real-time event name
      console.log("📤 Emitted sensorData event via Socket.IO");
    }

    // ⚠️ Store alert if not "safe"
    if (flag !== "safe") {
      const newNotification = new Notification({
        botId,
        message: `🚨 Alert: ${flag} detected!`,
        gas,
        flame,
        temperature,
        flag,
      });
      await newNotification.save();
      console.log("🔔 Notification saved:", newNotification);
    } else {
      console.log("✅ Flag is 'safe'. No alert stored.");
    }

    // ✅ Success response
    res.status(201).json({
      success: true,
      message: "Sensor data processed successfully",
    });

  } catch (err) {
    console.error("❌ Error handling sensor data:", err);
    res.status(500).json({
      success: false,
      error: "Server error while handling sensor data",
    });
  }
};


exports.getLatestData = async (req, res) => {
  try {
    const data = await SensorData.find().sort({ createdAt: -1 }).limit(1);
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch data" });
  }
};

