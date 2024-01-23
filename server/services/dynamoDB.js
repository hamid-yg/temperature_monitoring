const dynamoDB = require('../config/db');

class DynamoDBService {
  static async getTemperatureData(userId, deviceId) {
    const params = {
      TableName: 'TemperatureData',
      KeyConditionExpression: 'userId = :uid AND deviceId = :did',
      ExpressionAttributeValues: {
        ':uid': userId,
        ':did': deviceId,
      },
      ScanIndexForward: false,
    };

    try {
      const result = await dynamoDB.query(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error getting temperature data from DynamoDB:', error);
      throw error;
    }
  }

  static async storeDeviceTopic(deviceId, deviceTopic) {
    const params = {
      TableName: 'DeviceTopics',
      Item: {
        deviceId,
        deviceTopic,
      },
    };

    try {
      await dynamoDB.put(params).promise();
    } catch (error) {
      console.error('Error storing device topic in DynamoDB:', error);
      throw error;
    }
  }
}

module.exports = DynamoDBService;
