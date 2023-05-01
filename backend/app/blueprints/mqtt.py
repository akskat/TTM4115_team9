import json
import paho.mqtt.client as mqtt
from flask import current_app
from blueprints import student_blueprint
from models import Group, Quiz, Response, Answer

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("group/+/quiz/+/progress")

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))
    topic_parts = msg.topic.split("/")
    group_id = topic_parts[1]
    quiz_id = topic_parts[3]
    progress_data = json.loads(msg.payload.decode("utf-8"))

    user_id = progress_data['user_id']
    question_id = progress_data['question_id']
    option = progress_data['option']

    # Update the Answer model with the selected option and save it
    answer = Answer.objects(user_id=user_id, question_id=question_id).first()
    if not answer:
        answer = Answer(user_id=user_id, question_id=question_id, option=option)
    else:
        answer.option = option
    answer.save()

    # Send progress update to all other group members
    group = Group.objects(id=group_id).first()
    for member in group.students:
        if str(member.id) != user_id:
            client.publish(f"group/{group_id}/quiz/{quiz_id}/progress/{member.id}", json.dumps(progress_data))

def mqtt_setup():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(current_app.config["MQTT_BROKER"], current_app.config["MQTT_PORT"], 60)
    client.loop_start()

student_blueprint.before_app_first_request(mqtt_setup)
