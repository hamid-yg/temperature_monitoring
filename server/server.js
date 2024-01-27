const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./routes');
const DynamoDBService = require('./db');
const topic = "esp8266/pub";
const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
    clientId: 'ArduinoSoft',
    host: process.env.MQTT_BROKER_URL,
    port: 8883,
    privateKey: process.env.PRIVATE_KEY,
    clientCert: process.env.CERTIFICATE_IOT,
    caCert: process.env.AMAZON_ROOT,
});

device.on('connect', () => {
    console.log('Device connected successfully');

    device.subscribe(topic, (err) => {
        if (err) {
            console.log('error subscribing');
        }
    });

    device.on('message', (topic, payload) => {
        console.log('message', topic, payload.toString());
        const data = JSON.parse(payload.toString());
        if (data.deviceId !== undefined && data.temperature !== undefined && data.humidity !== undefined && data.time !== undefined) {
            DynamoDBService.storeTemperatureData(data.deviceId, data.temperature, data.humidity);
        }
    });

    device.publish(topic, JSON.stringify({ message: 'Temperature' }));
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);

app.get('/api/temperature', async (req, res) => {
    try {
        const result = await DynamoDBService.getTemperatureData("device1");
        if (result.Items === undefined) {
            res.status(404).json({ error: 'Temperature data not found' });
        }
        res.json(result.Items[0]);
    } catch (error) {
        console.error('Error getting temperature data from DynamoDB:', error);
        res.status(500).json({ error: 'Error getting temperature data from DynamoDB' });
    }
});

app.get('/api/devices', async (req, res) => {
    try {
        const result = await DynamoDBService.getDevices();
        if (result.Items === undefined) {
            res.status(404).json({ error: 'Devices not found' });
        }
        res.json(result.Items);
    } catch (error) {
        console.error('Error getting devices from DynamoDB:', error);
        res.status(500).json({ error: 'Error getting devices from DynamoDB' });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
});
