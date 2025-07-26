const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: String,
    botId: String,
    gas: Number,
    flame: Number,
    temperature: Number,
    flag: String,
  },
  { timestamps: true } // 👈 This adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Notification", notificationSchema);
