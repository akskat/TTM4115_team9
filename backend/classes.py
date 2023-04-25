class RatHolder:
    def __init__(self):
        # index of completed rats + time taken + answers
        self.completed_rats = []
        # index of current rat
        self.current_rat = -1
        # for each question the order of which the questions are answered is saved
        self.current_answers = []
        self.current_correct = 0
        self.time_started = 0

    def reset_rat_holder(self, time_taken):
        self.completed_rats.append([self.current_rat, time_taken, self.current_answers])
        self.current_rat = -1
        self.current_answers = []
        self.current_correct = 0
        self.time_started = 0

    def get_score(self):
        return_json = []
        for i, rat in enumerate(self.completed_rats):
            rat_json = {
                "number": i,
                "time_taken": rat[1],
                "answers": rat[2]
            }

            return_json.append(rat_json)
        return return_json


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
        # Array of options
        # [ text1, true/false ]
        # [ text2, true/false ]
        # [ text3, true/false ]
        # [ text4, true/false ]

    def add_question(self, question_text, array_of_options):
        self.questions.append([question_text, array_of_options])

    def get_rat_json(self, get_solution=False):
        question_array = []
        for question in enumerate(self.questions):
            option_array = []
            for option in enumerate(question[1]):
                option_array.append(option[0])
                if get_solution:
                    option_array.append(option[1])
            question_array.append([question[0], option_array])
        rat_json = {
            "name": self.name,
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


