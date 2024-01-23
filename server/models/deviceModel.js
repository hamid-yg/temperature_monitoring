const devices = [];
const AWS = require('../config/db');
const { IoTClient, CreateThingCommand } = require('@aws-sdk/client-iot');
const client = new IoTClient({ region: 'us-west-2' });

class DeviceModel {
  static getAllDevices() {
    return devices;
  }

  static registerDevice(device) {
    devices.push(device);
    this.createIoTObject(device.deviceId);
  }

  static getDeviceById(deviceId) {
    return devices.find((device) => device.deviceId === deviceId);
  }

  static getDevices(userId) {
    const params = {
      TableName: 'Devices',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    return dynamoDB.query(params).promise();
  }

  static async storeTemperatureData(userId, deviceId, temperature) {
    const timestamp = new Date().toISOString();

    const params = {
      TableName: 'TemperatureData',
      Item: {
        userId,
        deviceId,
        timestamp,
        temperature,
      },
    };

    try {
      await dynamoDB.put(params).promise();
      console.log(`Temperature data for ${deviceId} stored successfully`);
    } catch (error) {
      console.error('Error storing temperature data in DynamoDB:', error);
      throw error;
    }
  }

  static createIoTObject(deviceId) {
    const params = {
      thingName: deviceId,
    };

    client.send(new CreateThingCommand(params), (err, data) => {
      if (err) {
        console.log("Error creating IoT object: ", err);
      } else {
        console.log("IoT object created: ", data);
      }
    });
  }
}

module.exports = DeviceModel;
