from datetime import datetime


class RatHolder:
    def __init__(self):
        # index of completed rats + answers
        self.completed_rats = []
        # index of current rat
        self.current_rat = -1
        # for each question the order of which the questions are answered is saved
        self.current_answers = []
        self.current_correct = 0
        self.time_started = 0

    def add_to_completed(self, completed_number):
        self.completed_rats.append(completed_number)


class Group(RatHolder):
    def __init__(self, group_number):
        super().__init__()
        self.group_number = group_number
        self.members = []

    def add_member(self, user):
        self.members.append(user)


class User(RatHolder):
    def __init__(self, username, password="", is_admin=False):
        super().__init__()
        self.username = username
        self.password = password
        self.is_admin = is_admin

    def get_username(self):
        return self.username

    def get_password(self):
        return self.password

    def get_is_admin(self):
        return self.is_admin


class Rat:
    def __init__(self, name, rat_code):
        self.name = name
        self.rat_code = rat_code
        self.questions = []

    def add_question(self, question_text, array_of_answers):
        self.questions = [question_text, array_of_answers]

    def get_rat_json(self):
        question_array = []
        for question in enumerate(self.questions):
            question_array.append(question[0])
            question_array.append(question[1])
        rat_json = {
            "number": self.number,
            "questions": question_array
        }
        return rat_json

    def check_answer(self, user, question_number, option):
        #  Loops through the questions in given RAT
        for i, question in enumerate(self.questions):
            #  Finds right question
            if question_number - 1 == i:
                #  Loops through all the answer options for the questions
                for j, answer in enumerate(question[2]):
                    #  Finds the right answer option
                    if option - 1 == j:
                        user.current_answers[i].append(j)
                        if answer[1]:
                            return True
                        else:
                            return False

                    break
                return "Invalid answer"
        return "Invalid question"
