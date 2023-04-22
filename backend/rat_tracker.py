import json
import classes
# rat_array = [
#     {
#         "number": 1,
#         "questions": [
#             [
#                 1,
#                 [
#                     ["test", True],
#                     ["test", False],
#                     ["test", False],
#                     ["test", False]
#                 ]
#             ],
#             [
#                 2,
#                 [
#                     ["test", True],
#                     ["test", False],
#                     ["test", False],
#                     ["test", False]
#                 ]
#             ],
#             [
#                 3,
#                 [
#                     ["test", True],
#                     ["test", False],
#                     ["test", False],
#                     ["test", False]
#                 ]
#             ]
#         ]
#     },
# ]


class RatTracker:
    def __int__(self):
        self.rats = []
        self.groups = []
        self.users = []

    def get_rat(self):
        pass

    def get_question(self):
        pass

    def get_user(self, msg):
        username = ""
        topic_length = len("team9/request/")
        slash_index = 0
        for i, letter in enumerate(msg.topic, topic_length):
            if letter == "/":
                slash_index = i
                break

        for i in range(13, slash_index):
            username += msg.topic(i)

        for i, user in enumerate(self.users):
            if username == user.username:
                return user

    def rat_logic(self, msg):
        user = self.get_user(msg)
        json_msg = json.loads(msg.payload.decode("utf-8"))
        if "/rat" in msg.topic:
            self.get_rat()
        if "/question" in msg.topic:
            self.get_question()
