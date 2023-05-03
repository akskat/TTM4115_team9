def verify_user(data, groups, utils):
    try:
        username = data["username"]
        password = data["password"]

        # Iterate through each group
        for group in groups:
            # Iterate through each member of the group
            for member in group.members:
                # check if the current member's login details matches the database
                if member.username == username and member.password == password:
                    response = {
                        "username": username,
                        "group": group.group_number
                    }
                    if group.group_number == "admin":
                        response["message"] = "admin"
                        return utils.text_to_json(response, 200, True)
                    return utils.text_to_json(response, 200, True)

        return utils.text_to_json("Invalid username or password", 403)
    except(KeyError, ValueError):
        return utils.text_to_json("Invalid request", 400)
