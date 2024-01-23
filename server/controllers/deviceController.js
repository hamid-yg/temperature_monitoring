const DeviceModel = require('../models/deviceModel');
const UserModel = require('../models/userModel');
const mqttClient = require('../config/mqtt');
const dynamoDB = require('../config/db');

class DeviceController {
  static async registerDevice(req, res) {
    const { deviceId, userId } = req.body;

    if (!deviceId || !userId) {
      return res.status(400).json({ error: 'Device ID and User ID are required' });
    }

    const existingDevice = DeviceModel.getDeviceById(deviceId);

    if (existingDevice) {
      return res.status(409).json({ error: 'Device already registered' });
    }

    DeviceModel.registerDevice({ deviceId });

    await UserModel.associateDevice(userId, deviceId);

    const message = 'Welcome to the IoT world! Your device is now registered';
    mqttClient.publish(`devices/${deviceId}`, message);

    res.status(201).json({ message: 'Device registered successfully' });
  }

  static async getTemperatureData(req, res) {
    const { userId, deviceId } = req.params;

    try {
      const temperatureData = await dynamoDB.getTemperatureData(userId, deviceId);

      if (temperatureData) {
        res.json(temperatureData);
      } else {
        res.status(404).json({ error: 'Temperature data not found for the device and user' });
      }
    } catch (error) {
      console.error('Error getting temperature data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static getAllDevices(req, res) {
    const devices = DeviceModel.getAllDevices();
    res.json(devices);
  }
}

module.exports = DeviceController;
