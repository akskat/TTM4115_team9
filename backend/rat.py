import json

# {
# Quiz number
# List of questions [
#       [
#           Question number
#           [
#               [answer text, is right],
#               [answer text, is right],
#               [answer text, is right],
#               [answer text, is right]
#           ]
#       ]
#   ]
# }

rat_array = [
    {
        "number": 1,
        "questions": [
            [
                1,
                [
                    ["test", true],
                    ["test", false],
                    ["test", false],
                    ["test", false]
                ]
            ],
            [
                2,
                [
                    ["test", true],
                    ["test", false],
                    ["test", false],
                    ["test", false]
                ]
            ],
            [
                2,
                [
                    ["test", true],
                    ["test", false],
                    ["test", false],
                    ["test", false]
                ]
            ]
        ]
    },
]

user_status = [
    # Format
    # group_status[0] = username
    # group_status[1] = current Rat
    # group_status[2] = answers in current Rat
    # group_status[2][0] = answers on first question in rat
    # group_status = ["4", "RatNr1", [["Answer1", "Answer4"], ["Answer4"], ["Answer3", "Answer1" ,"Answer4"]]
]


class rat:
    def __int__(self):
        self.msg = ""

    def getRAT(self):
        json_msg = json.loads(msg.payload.decode("utf-8"))

    def getQuestion(self):
        print("Question")

    def rat_logic(self, msg):
        self.msg = msg
        if "/rat" in msg.topic:
            getRAT(self)
        if "/question" in msg.topic:
            getQuestion(self)
