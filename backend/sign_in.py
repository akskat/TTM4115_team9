import json
import utils


def verify_user(msg, groups):
    try:
        json_msg = json.loads(msg.payload.decode("utf-8"))
        username = json_msg["username"]
        password = json_msg["password"]

        # Iterate through each group
        for group in groups:
            # Iterate through each member of the group
            for member in group.members:
                # check if the current member's login details matches the database
                if member.username == username and member.password == password:
                    return utils.text_to_json("Logged in", 200)

        return utils.text_to_json("Invalid username or password", 403)
    except(KeyError, ValueError):
        return utils.text_to_json("Invalid request", 400)
