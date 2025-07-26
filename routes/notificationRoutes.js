const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/latest", notificationController.getLatestNotification);
router.get("/all", notificationController.getAllNotifications);


module.exports = router;
