class RatHolder:
    def __init__(self):
        self.completed_rats = []
        self.current_rat = -1
        self.current_answers = []

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
    def __init__(self, number):
        self.number = number
        self.questions = []

    def add_question(self, question, array_of_answers):
        self.questions = [len(self.questions) + 1, question, array_of_answers]

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
