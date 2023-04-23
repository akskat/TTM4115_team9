import json
import classes


class SignIn:
    def __init__(self):
        pass

    def verify_user(self, msg, groups):
        try:
            json_msg = json.loads(msg.payload.decode("utf-8"))
            username = json_msg["username"]
            password = json_msg["password"]

            # Iterate through each group
            for group in groups:
                # Iterate through each member of the group
                for member in group.members:
                    # check if the current member's login details matches the data base
                    if member.username == username and member.password == password:
                        print("you are loged in as username: {} with password: {}".format(member.username, member.password))
                        print("you belong to group nr.: {}".format(group.group_number))
                        return

            print("wrong login! username: {} with password: {}".format(username, password))


        except(KeyError, ValueError):
            print("Invalid JSON format on login")
