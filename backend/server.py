from threading import Thread
import paho.mqtt.client as mqtt
import rat_tracker
import sign_in
import utils


class Server:
    def __init__(self):
        self.count = 0
        self.client = mqtt.Client()
        # read groups and users from file
        self.groups, self.users = utils.read_group_file()
        # Sets up the RAT tracker
        self.rat_tracker = rat_tracker.RatTracker(self.groups, self.users)
        print("Server initialised")

    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print("on_message(): topic: {}".format(msg.topic))

        if "team9/request/" in msg.topic:
            self.rat_tracker.rat_logic(msg)

        elif "team9/login/" in msg.topic:
            sign_in.verify_user(msg, self.groups)

        self.count = self.count + 1
        if self.count == 5:
            self.client.disconnect()
            print("Disconnected after 5 messages")
        elif "STOP_SERVER" in msg.topic:
            self.client.disconnect()
            print("Got stop signal. Exiting")

    def start(self, broker, port):
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
server.start("mqtt20.iik.ntnu.no", 1883)
