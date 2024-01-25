const express = require('express');
const dotenv = require('dotenv');
const mqtt = require('mqtt');

const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./routes');
const DynamoDBService = require('./db');
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

dotenv.config();

client.on('connect', () => {
    console.log('MQTT client connected');
});

client.on('message', async (receivedTopic, message) => {
    if (receivedTopic === topic) {
        try {
            const data = JSON.parse(message.toString());
            await DynamoDBService.storeTemperatureData(topic, data);
        } catch (error) {
            console.error('Error storing temperature data:', error);
        }
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
