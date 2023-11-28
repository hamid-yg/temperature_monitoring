const awsIot = require('aws-iot-device-sdk');
const sensor = require("node-dht-sensor");

const useDummyData = true

const device = awsIot.device({
    clientId: 'esp8266',
    host: 'apnje8usx8np-ats.iot.us-west-2.amazonaws.com',
    port: 8883,
    keyPath: './esp8266/private.pem.key',
    certPath: './esp8266/certificate.pem.crt',
    caPath: './esp8266/esp8266.cert.pem',
});

const IoTDevice = {
    serialNumber: "SN-D7F3C8947867",
    date: new Date().toISOString(),
    activated: true,
    device: "esp8266",
    type: "esp8266",
    payload: {}
}

const home_topic = "home/temperature"

const getSensorData = (cb) =>
    useDummyData ? getDummySensorData(cb) : sensor.read(11, 2, function (err, temperature, humidity) {
        if (!err) {
            const temperatureData = {temp: `${temperature}°C`, humidity: `${humidity}%`};
            console.log(`Getting Data => `, temperatureData);
            return cb(temperatureData);
        } else
            console.log(err);
});

const getDummySensorData = (cb) => {
    const temperatureData = { temp: '100°C', humidity: '52%' }
    return cb(temperatureData)
}

const sendData = (data) => {
    const telemetryData = JSON.stringify({
        ...IoTDevice,
        payload: data
    })
    console.log('Sending Data => ', telemetryData);
    return device.publish(home_topic, telemetryData);
}

device
    .on('connect', () => setInterval(() => getSensorData(sendData), 3000))
    .on('message', (topic, payload) => console.log('Response Message: ', topic, payload.toString()))
    .on('error', (topic, payload) => console.log('Error: ', topic, payload.toString()));
