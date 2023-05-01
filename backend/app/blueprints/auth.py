from flask import Blueprint, request, jsonify, session
from app.models.user import User
from utils.decorators import login_required
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
@cross_origin()
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    role = request.json.get('role')

    if not username or not password or not role:
        return jsonify(error="All fields are required"), 400

    user = User.objects(username=username).first()
    if user:
        return jsonify(error="Username already exists"), 400

    user = User(username=username, password=generate_password_hash(password), role=role)
    user.save()

    return jsonify(success="User registered"), 201

@auth_blueprint.route('/login', methods=['POST'])
@cross_origin()
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.objects(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.username)
        return jsonify(success=True, access_token=access_token, role=user.role), 200

    return jsonify(success=False, error="Invalid username or password"), 401

@auth_blueprint.route('/logout', methods=['POST'])
@login_required
def logout():
    session.pop('user_id', None)
    return jsonify(success="Logged out"), 200

@auth_blueprint.route('/token/validity', methods=['GET'])
@jwt_required()
def check_token_validity():
    current_user = get_jwt_identity()
    if current_user:
        return jsonify(valid=True), 200
    else:
        return jsonify(valid=False), 401
