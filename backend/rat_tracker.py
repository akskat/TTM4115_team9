from datetime import datetime
import json
import classes
import utils


def reset_rat_holder(user, time_taken):
    user.completed_rats.append([user.current_rat, time_taken, user.current_answers])
    user.current_rat = -1
    user.current_answers = []
    user.current_correct = 0
    user.time_started = 0


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
                return int(group_number), 0
            except ValueError:
                return "Invalid group number", -1
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

            # Checks if user is an admin
            for i, user in enumerate(self.groups[0]):
                if username == user.username:
                    return i, 1

            for i, user in enumerate(self.users):
                if username == user.username:
                    #  returns index of user
                    return i, 2

            return "Invalid user", -1

    def rat_logic(self, msg):
        # expected topic /team9/request/username/rat/question
        # expected topic /team9/request/group"Number"/rat/question
        user = ""
        user_index, type = self.get_user(msg.topic)
        if user_index.isnumeric():
            if type == 0:
                # is a group
                user = self.groups[user]
            elif type == 1:
                # is a admin
                user = self.groups[0][i]
            elif type == 2:
                # is a user
                user = self.users[user]
        else:
            return utils.text_to_json(user_index, 404)

        json_msg = json.loads(msg.payload.decode("utf-8"))

        if "/rat" in msg.topic:
            # expected = {
            #     "code": "code_here"
            # }
            if user.current_rat != -1:
                return utils.text_to_json("Another RAT is under process", 400)

            rat_index = self.get_rat(json_msg.code)
            if rat_index.isnumeric():
                # Checks if RAT has already been completed
                for i, rat in enumerate(user.completed_rats):
                    if rat_index == rat[0]:
                        return utils.text_to_json("RAT already completed", 400)

                # Initialises current data
                user.current_rat = rat_index
                user.time_started = datetime.now()
                for i in enumerate(self.rats[rat_index].questions):
                    user.current_answers[i] = []

                # Returns the RAT with questions in JSON format
                return utils.text_to_json(self.rats[rat_index].get_rat_json(), 200)
            else:
                return utils.text_to_json(rat_index, 404)
        elif "/rat/question" in msg.topic:
            # expected =
            #     "question_number": "number (1-10)"
            #     "option": "option_number (1-4)"
            # }
            if (datetime.now() - user.time_started).seconds / 60 >= 20:
                if user.current_rat != -1:
                    reset_rat_holder(user, 20)
                    return utils.text_to_json("Time limit exceeded", 400)
                else:
                    return utils.text_to_json("RAT already completed", 400)

            answer_response = self.check_answer(user, json_msg)
            if answer_response:
                user.current_correct += 1
                if user.current_correct == len(self.rats[user.current_rat].questions):
                    reset_rat_holder(user, (datetime.now() - user.time_started).seconds / 60)
                    return utils.text_to_json("Completed RATs", 200)

                return utils.text_to_json("Correct answer", 200)
            elif not answer_response:
                return utils.text_to_json("Incorrect answer", 200)
            else:
                return utils.text_to_json("Invalid answer", 404)
        elif "/rat/leaderboard" in msg.topic:
            if user.is_admin:
                return utils.text_to_json("Leaderboard", 200)
            else:
                return utils.text_to_json("Unauthorised", 401)
