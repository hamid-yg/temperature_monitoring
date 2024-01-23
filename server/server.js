const express = require('express');
const mqtt = require('mqtt');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

const { dynamoDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use('/api', deviceRoutes);

client.on('connect', () => {
    client.subscribe('temperature');
});

client.on('message', (topic, message) => {
    const temperatureData = JSON.parse(message.toString());

    const params = {
        TableName: 'TemperatureData',
        Item: {
            deviceId: temperatureData.deviceId,
            timestamp: new Date().toISOString(),
            temperature: temperatureData.temperature,
        },
    };

    dynamoDB.put(params, (err, data) => {
        if (err) {
            console.error('Error storing data in DynamoDB:', err);
        } else {
            console.log('Temperature data stored in DynamoDB:', data);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
