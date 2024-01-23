const uuid = require('uuid');
const { dynamoDB } = require('../config/db');

class UserModel {
  static async createUser(username, email) {
    const userId = uuid.v4();
    const params = {
      TableName: 'Users',
      Item: {
        userId,
        username,
        email,
        admin: false,
        devices: [],
      },
    };

    try {
      await dynamoDB.put(params).promise();
      return userId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUser(userId) {
    const params = {
      TableName: 'Users',
      Key: {
        userId,
      },
    };

    try {
      const result = await dynamoDB.get(params).promise();
      return result.Item;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async getUsers(userRole) {
    if (userRole !== 'admin') {
      throw new Error('Permission denied: You must be an admin to get all users.');
    }

    const params = {
      TableName: 'Users',
    };

    try {
      const result = await dynamoDB.scan(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  static async associateDevice(userId, deviceId) {
    const params = {
      TableName: 'Users',
      Key: {
        userId,
      },
      UpdateExpression: 'SET #devices = list_append(if_not_exists(#devices, :empty_list), :deviceId)',
      ExpressionAttributeNames: {
        '#devices': 'devices',
      },
      ExpressionAttributeValues: {
        ':deviceId': [deviceId],
        ':empty_list': [],
      },
    };

    try {
      await dynamoDB.update(params).promise();
      await dynamoDB.storeDeviceTopic(deviceId, `devices/${deviceId}`);
      console.log(`Device ${deviceId} associated with user ${userId}`);
    } catch (error) {
      console.error('Error associating device:', error);
      throw error;
    }
  }
}

module.exports = UserModel;
