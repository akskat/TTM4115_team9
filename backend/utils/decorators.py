from functools import wraps
from flask import jsonify, request
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity

def login_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function

def teacher_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        user = User.objects(username=get_jwt_identity()).first()
        if not user.is_teacher():
            return jsonify(error="Teacher required"), 403
        return f(*args, **kwargs)
    return decorated_function

def student_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        user = User.objects(username=get_jwt_identity()).first()
        if not user.is_student():
            return jsonify(error="Student required"), 403
        return f(*args, **kwargs)
    return decorated_function
