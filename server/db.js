const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

class DynamoDBService {

  static async storeTemperatureData(deviceId, temperature) {
    const params = {
      TableName: 'TemperatureData',
      Item: {
        deviceId,
        timestamp: new Date().toISOString(),
        temperature,
      },
    };

    try {
      await client.put(params).promise();
    } catch (error) {
      console.error('Error storing temperature data in DynamoDB:', error);
      throw error;
    }
  }

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
      const result = await client.query(params).promise();
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
      await client.put(params).promise();
    } catch (error) {
      console.error('Error storing device topic in DynamoDB:', error);
      throw error;
    }
  }
}

module.exports = {
    client,
    DynamoDBService
};
