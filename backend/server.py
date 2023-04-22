from threading import Thread
import paho.mqtt.client as mqtt
import rat_tracker

broker, port = "mqtt20.iik.ntnu.no", 1883
ratTracker = rat_tracker.RatTracker()


class Server:
    def __init__(self):
        self.count = 0
        print(self.count)

    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print("on_message(): topic: {}".format(msg.topic))

        if "team9/request/" in msg.topic:
            ratTracker.rat_logic(msg)

        self.count = self.count + 1
        if self.count == 3:
            self.client.disconnect()
            print("disconnected after 20 messages")

    def start(self, broker, port):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)

        self.client.subscribe("team9/#")
        try:
            thread = Thread(target=self.client.loop_forever)
            thread.start()
        except KeyboardInterrupt:
            print("Interrupted")
            self.client.disconnect()


server = Server()
server.start(broker, port)
