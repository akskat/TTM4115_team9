import json
import classes


class RatTracker:
    def __init__(self, groups, users):
        self.rats = []
        self.groups = groups
        self.users = users

    def get_rat(self, rat_code):
        for i, rat in enumerate(self.rats):
            if rat_code == rat.rat_code:
                return i

        return "Invalid RAT code"

    def check_answer(self, user, json_msg):
        rat = self.rats[user.current_rat]
        return rat.check_answer(user, json_msg.question_number, json_msg.option)

    def get_user(self, topic):
        if "group" in topic:
            topic_length = len("team9/request/group")
            group_number = int(topic(topic_length))
            try:
                return int(group_number)
            except ValueError:
                return "Invalid group number"
        else:
            username = ""
            topic_length = len("team9/request/")
            slash_index = 0
            for i, letter in enumerate(topic, topic_length):
                if letter == "/":
                    slash_index = i
                    break

            for i in range(13, slash_index):
                username += topic(i)

            for i, user in enumerate(self.users):
                if username == user.username:
                    #  returns index of user
                    return i

            return "Invalid user"

    def rat_logic(self, msg):
        # expected topic /team9/request/username/rat/question
        # expected topic /team9/request/group"Number"/rat/question
        user = self.get_user(msg.topic)
        if user.isnumeric():
            user = self.users[user]
        else:
            return "Invalid User"

        json_msg = json.loads(msg.payload.decode("utf-8"))

        if "/rat" in msg.topic:
            # expected = {
            #     "code": "code_here"
            # }
            rat_index = self.get_rat(json_msg.code)
            if rat_index.isnumeric():
                user.current_rat = rat_index
                for i in enumerate(self.rats[rat_index].questions):
                    user.current_answers[i] = []

                # Returns the RAT with questions in JSON format
                return json.dumps(self.rats[rat_index].get_rat_json())
            else:
                return rat_index
        elif "/rat/question" in msg.topic:
            # expected =
            #     "question_number": "number (1-10)"
            #     "option": "option_number (1-4)"
            # }
            answer_response = self.check_answer(user, json_msg)
            if answer_response:
                return "Correct answer"
            elif not answer_response:
                return "Incorrect answer"
            else:
                "Invalid answer"
