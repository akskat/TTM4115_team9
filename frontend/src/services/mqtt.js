import mqtt from 'mqtt';

class MqttService {
  constructor() {
    this.client = mqtt.connect('mqtt://broker.hivemq.com:1883');
  }

  publish(topic, message) {
    this.client.publish(topic, message);
  }

  subscribe(topic, callback) {
    this.client.subscribe(topic);
    this.client.on('message', (topic, message) => {
      callback(message.toString());
    });
  }
}

export default new MqttService();
