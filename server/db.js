const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

class DynamoDBService {

  static async storeTemperatureData(deviceId, temperature, humidity) {
    const command = new GetCommand({
      TableName: 'Devices',
      Key: {
        deviceId,
      },
    });

    const result = await docClient.send(command);

    if (result.Item === undefined) {
      const command = new PutCommand({
        TableName: 'Devices',
        Item: {
          deviceId,
          temperature,
          humidity,
          date_time: Date.now()
        },
      });

      try {
        const result = await docClient.send(command);
        return result;
      } catch (error) {
        console.error('Error storing temperature data in DynamoDB:', error);
        throw error;
      }
    } else {
      const command = new UpdateCommand({
        TableName: 'Devices',
        Key: {
          deviceId,
        },
        UpdateExpression: "set temperature = :t, humidity = :h, date_time = :ts",
        ExpressionAttributeValues: {
          ":t": temperature,
          ":h": humidity,
          ":ts": Date.now()
        },
        ReturnValues: "UPDATED_NEW"
      });

      try {
        const result = await docClient.send(command);
        return result;
      } catch (error) {
        console.error('Error storing temperature data in DynamoDB:', error);
        throw error;
      }
    }
  }

  static async getTemperatureData(deviceId) {
    const command = new ScanCommand({
      TableName: 'Devices',
      FilterExpression: "deviceId = :deviceId",
      ExpressionAttributeValues: {
        ":deviceId": deviceId
      }
    });

    try {
      const result = await docClient.send(command);
      return result;
    } catch (error) {
      console.error('Error getting temperature data from DynamoDB:', error);
      throw error;
    }
  }

  static async getDevices() {
    const command = new ScanCommand({
      TableName: 'Devices',
    });

    try {
      const result = await docClient.send(command);
      return result;
    } catch (error) {
      console.error('Error getting devices from DynamoDB:', error);
      throw error;
    }
  }
}

module.exports = DynamoDBService;
