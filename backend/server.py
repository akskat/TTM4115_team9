from threading import Thread
import paho.mqtt.client as mqtt
import rat_tracker
import sign_in
import classes

broker, port = "mqtt20.iik.ntnu.no", 1883
ratTracker = rat_tracker.RatTracker()


class Server:
    def __init__(self):
        self.count = 0
        print(self.count)
        
        # read groups from file
        self.groups = []
        with open("groups.txt") as f:
            for line in f:
                group_info = line.strip().split(":")
                group_name = group_info[0]
                users_info = group_info[1:]
                users = []
                for i in range(0, len(users_info), 2):
                    username = users_info[i]
                    password = users_info[i+1]
                    user = classes.User(username, password)
                    users.append(user)
                    group = classes.Group(group_name)
                    for user in users:
                        group.add_member(user)
                    self.groups.append(group)



    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print("on_message(): topic: {}".format(msg.topic))

        if "team9/request/" in msg.topic:
            ratTracker.rat_logic(msg)

        elif "team9/login/" in msg.topic:
            sign_in.SignIn().verify_user(msg, self.groups)

        self.count = self.count + 1
        if self.count == 20:
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
