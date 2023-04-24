import classes


def read_group_file():
    with open("groups.txt") as file:
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
        return group, return_users


def text_to_json(text, response):
    return_json = {
        "message": text,
        "response": response
    }
    return json.dumps(return_json)


def read_RAT_Question(rat = 'rat_array.txt'):
    with open(rat, 'r') as file:
        data = json.loads(file.read())
        
    return data