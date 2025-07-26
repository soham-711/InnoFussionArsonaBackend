const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// ESP32 sends data here (POST)
router.post('/data', sensorController.receiveSensorData);

// Dashboard fetches latest data (GET)
router.get('/latest', sensorController.getLatestData);

module.exports = router;
