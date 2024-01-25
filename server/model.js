const uuid = require('uuid');
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

class UserModel {
  static async createUser(username, email) {
    const userId = uuid.v4();
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      TableName: 'Users',
      Item: marshall({
        userId,
        username,
        email,
        admin: false,
        devices: [],
        wifi: {
          ssid: '',
          password_wifi: '',
        },
      }),
    };

    try {
      await client.send(new PutItemCommand(params));
      return userId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUser(userId) {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      TableName: 'Users',
      Key: {
        userId,
      },
    };

    try {
      const documentClient = DynamoDBDocumentClient.from(client);
      const { Item } = await documentClient.send(new GetItemCommand(params));
      // const result = await client.send(new GetItemCommand(params));
      // console.log('Result:', result);
      // if (!Item || Object.keys(Item).length === 0) {
      //   throw new Error('User not found');
      // }
      // console.log(Item);
      // if (!Item) {
      //   throw new Error('User not found');
      // }
      return Item;
      // return params;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async getUsers(userRole) {
    if (userRole !== 'admin') {
      throw new Error('Permission denied: You must be an admin to get all users.');
    }

    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      TableName: 'Users',
    };

    try {
      const result = await client.send(new ScanCommand(params));
      return result.Items;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  static async associateDevice(userId, deviceId) {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

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
      await client.send(new UpdateItemCommand(params));
      await DynamoDBClient.storeDeviceTopic(deviceId, `devices/${deviceId}`);
      console.log(`Device ${deviceId} associated with user ${userId}`);
    } catch (error) {
      console.error('Error associating device:', error);
      throw error;
    }
  }
}

module.exports = UserModel;
