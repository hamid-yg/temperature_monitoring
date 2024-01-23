const express = require('express');
const router = express.Router();
const deviceModel = require('../models/deviceModel');

// Create a new device
router.post('/devices', async (req, res) => {
  const { deviceId, userId } = req.body;

  try {
    const device = await deviceModel.registerDevice(deviceId, userId);
    res.status(201).json({ device, message: 'Device created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get device by ID
router.get('/devices/:deviceId', async (req, res) => {
  const { deviceId } = req.params;

  try {
    const device = await deviceModel.getDeviceById(deviceId);

    if (device) {
      res.json(device);
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/devices', async (req, res) => {
    const { userId } = req.query;

    try {
        const devices = await deviceModel.getDevices(userId);
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
