from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config
from app.database import db
from app.blueprints.quiz import quiz_blueprint
from app.blueprints.student import student_blueprint
from app.blueprints.teacher import teacher_blueprint
from app.blueprints.auth import auth_blueprint

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='frontend/build', static_url_path='')
    app.config.from_object(config_class)
    jwt = JWTManager(app)
    db.init_app(app)
    CORS(app, supports_credentials=True)

    
    app.register_blueprint(quiz_blueprint, url_prefix='/quiz')
    app.register_blueprint(student_blueprint, url_prefix='/student')
    app.register_blueprint(teacher_blueprint, url_prefix='/teacher')
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    return app
