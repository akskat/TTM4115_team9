from flask import Flask
from config import get_config
from app.database import db
from flask_mqtt import Mqtt
from auth import auth_blueprint
from blueprints import quiz_blueprint, student_blueprint, teacher_blueprint, mqtt_blueprint
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(get_config())

db.initialize_db(app)
mqtt = Mqtt(app)

app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(quiz_blueprint, url_prefix='/quiz')
app.register_blueprint(student_blueprint, url_prefix='/student')
app.register_blueprint(teacher_blueprint, url_prefix='/teacher')
app.register_blueprint(mqtt_blueprint, url_prefix='/mqtt')

if __name__ == '__main__':
    app.run()
