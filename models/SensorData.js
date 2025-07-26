const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  gas: Number,
  flame: Number,
  temperature: Number,
  botId: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SensorData', sensorSchema);
