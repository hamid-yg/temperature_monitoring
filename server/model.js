const uuid = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

class UserModel {
  static async createUser(email, password) {
    const userId = uuid.v4();

    const command = new PutCommand({
      TableName: 'Users',
      Item: {
        userId,
        email,
        password,
        admin: false,
        devices: [],
        wifi: {
          ssid: '',
          password_wifi: '',
        },
      },
    });

    try {
      await docClient.send(command);
      return userId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUser(email, password) {

    const command = new GetCommand({
      TableName: 'Users',
      Key: {
        email: email,
      },
    });

    try {
      const result = await docClient.send(command);
      const user = result.Item;
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async getUsers(userRole) {
    if (userRole !== 'admin') {
      throw new Error('Permission denied: You must be an admin to get all users.');
    }

    const command = new ScanCommand({
      TableName: 'Users',
    });

    try {
      const result = await docClient.send(command);
      return result.Items;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

}

module.exports = UserModel;
