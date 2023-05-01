import classes
import json


def read_group_file(file_name="groups.txt"):
    with open(file_name) as file:
        groups = []
        for line in file:
            group_info = line.strip().split(":")
            group_name = group_info[0]
            users_info = group_info[1:]
            users = []
            for i in range(0, len(users_info), 2):
                username = users_info[i]
                password = users_info[i + 1]
                user = classes.User(username, password)
                users.append(user)
                group = classes.Group(group_name)
                for user in users:
                    group.add_member(user)
                groups.append(group)

        return_users = []
        for i, group in enumerate(groups, 1):
            for user in group.members:
                return_users.append(user)
        return groups, return_users


def text_to_json(text, response):
    return_json = {
        "message": text,
        "response": response
    }
    return json.dumps(return_json)


def read_rats_file(file_name='rat_array.txt'):
    with open(file_name, 'r') as file:
        data = json.load(file)

    rats = []
    for rat_data in data:
        rat_name = rat_data['rat_name']
        rat_code = rat_data['rat_code']

        rat = classes.Rat(rat_name, rat_code)

        for questions_data in rat_data['questions']:
            question_number, answers = questions_data

            questions_text = f"Question {question_number}: {answers[0][0]}"

            array_of_answer = []
            for answer in answers:
                array_of_answer.append([answer[0], answer[1]])

            rat.add_question(questions_text, array_of_answer)

        rats.append(rat)

    return data
