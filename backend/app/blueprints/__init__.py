from .auth import auth_blueprint
from .quiz import quiz_blueprint
from .student import student_blueprint
from .teacher import teacher_blueprint

def register_blueprints(app):
    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
    app.register_blueprint(quiz_blueprint, url_prefix='/api/quiz')
    app.register_blueprint(student_blueprint, url_prefix='/api/student')
    app.register_blueprint(teacher_blueprint, url_prefix='/api/teacher')
