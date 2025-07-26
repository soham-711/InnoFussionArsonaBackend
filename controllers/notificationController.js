// const Notification = require("../models/notification");

// exports.getLatestNotification = async (req, res) => {
//   try {
//     const latest = await Notification.find().sort({ createdAt: -1 }).limit(1);
//     res.status(200).json(latest[0]); // return only the latest
//   } catch (err) {
//     res.status(500).json({ error: "Unable to fetch latest notification" });
//   }
// };


// exports.getAllNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find().sort({ createdAt: -1 });
//     res.status(200).json([notifications]);
//   } catch (err) {
//     console.error("Error fetching notifications:", err); // 👈 Add this
//     res.status(500).json({ error: "Unable to fetch notifications", details: err.message });
//   }
// };


// controllers/notificationController.js
const Notification = require('../models/notification');

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).json(notifications); // Return an array directly
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json([]);
  }
};

// Optional: only latest 1 alert
exports.getLatestNotification = async (req, res) => {
  try {
    const latest = await Notification.findOne().sort({ timestamp: -1 });
    res.status(200).json(latest || {});
  } catch (err) {
    console.error("Error fetching latest notification:", err);
    res.status(500).json({});
  }
};


