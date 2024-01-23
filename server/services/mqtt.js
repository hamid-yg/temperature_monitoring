const mqtt = require('mqtt');

class MqttService {
  constructor() {
    this.client = mqtt.connect(process.env.MQTT_BROKER_URL);
    this.client.on('connect', () => {
      console.log('MQTT client connected');
    });
  }

  subscribe(topic, callback) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error('Error subscribing to topic:', err);
        throw err;
      }
    });

    this.client.on('message', (receivedTopic, message) => {
        if (receivedTopic === topic)
            callback(topic, message.toString());
    });
  }

  publish(topic, message) {
    this.client.publish(topic, message, (err) => {
      if (err) {
        console.error('Error publishing message:', err);
        throw err;
      }
    });
  }
}

module.exports = new MqttService();
