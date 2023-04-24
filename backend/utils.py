import classes


def read_file():
    with open("groups.txt") as file:
        groups = []
        users = []
        for line in file:
            group_info = line.strip().split(":")
            group_name = group_info[0]
            users_info = group_info[1:]
            for i in range(0, len(users_info), 2):
                username = users_info[i]
                password = users_info[i + 1]
                user = classes.User(username, password)
                users.append(user)
                group = classes.Group(group_name)
                for user in users:
                    group.add_member(user)
                groups.append(group)
        return group, users
