from flask import Flask, request
from flask_cors import CORS
import rat_tracker
import sign_in
import utils

# Sets up the server
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Inits utils
app_utils = utils.Utils(app)
# Reads file data
groups, users = utils.read_group_file()
rats = utils.read_rats_file()
# Sets up the RAT tracker
rat_tracker = rat_tracker.RatTracker(rats, groups, users, app_utils)

@app.route("/login", methods = ['POST'])
def login():
    data = request.json
    return sign_in.verify_user(data, groups, app_utils)


@app.route("/<path:text>", methods = ['POST'])
def requesting(text):
    if "request/" in text:
        data = request.json
        return rat_tracker.rat_logic(data, text)
    else:
        return app_utils.text_to_json("Error", 404)


if __name__ == "__main__":
    app.run()