import json
from flask import Blueprint, request, jsonify, session
from app.models import Quiz, Question, Group, User
from app.database import db
from utils.decorators import teacher_required
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from bson.objectid import ObjectId


teacher_blueprint = Blueprint('teacher', __name__)

@teacher_blueprint.route('/quizzes', methods=['GET'])
@cross_origin()
@jwt_required()
@teacher_required
def get_quizzes():
    teacher_username = get_jwt_identity()
    
    teacher = User.objects(username=teacher_username).first()
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    quizzes = Quiz.objects(teacher=teacher.id)
    return jsonify([quiz.serialize() for quiz in quizzes]), 200

@teacher_blueprint.route('/quiz/create', methods=['POST'])
@cross_origin()
@jwt_required()
@teacher_required
def create_quiz():
    data = json.loads(request.data)
    name = data.get('name')
    questions_data = data.get('questions')
    access_code = data.get('access_code')
    time_limit = data.get('time_limit', 20)  # Default to 20 minutes if not provided
    teacher_username = get_jwt_identity()

    teacher = User.objects(username=teacher_username).first()
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    if not name or not questions_data or not access_code:
        return jsonify(error="All fields are required"), 400

    quiz = Quiz(name=name, access_code=access_code, teacher=teacher, time_limit=time_limit)
    quiz.save()

    for question_data in questions_data:
        question_text = question_data.get('question')
        options = question_data.get('options')
        answer = question_data.get('answer')
        question = Question(text=question_text, options=options, answer=answer)
        question.save()
        quiz.questions.append(question)

    quiz.save()
    return jsonify(quiz.serialize()), 201






@teacher_blueprint.route('/quiz/<int:quiz_id>/edit', methods=['PUT'])
@cross_origin()
@jwt_required()
@teacher_required
def edit_quiz(quiz_id):
    data = request.json
    name = data.get('name')
    questions_data = data.get('questions')

    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify(error="Quiz not found"), 404

    if name:
        quiz.name = name

    if questions_data:
        for question_data in questions_data:
            question_id = question_data.get('id')
            text = question_data.get('text')
            options = question_data.get('options')
            answer = question_data.get('answer')

            question = Question.query.get(question_id)
            if not question:
                return jsonify(error="Question not found"), 404

            question.text = text
            question.options = options
            question.answer = answer

    db.session.commit()
    return jsonify(quiz.serialize()), 200

@teacher_blueprint.route('/quiz/<quiz_id>', methods=['DELETE'])
@cross_origin()
@jwt_required()
@teacher_required
def delete_quiz(quiz_id):
    teacher_username = get_jwt_identity()

    teacher = User.objects(username=teacher_username).first()
    if not teacher:
        return jsonify(error="Teacher not found"), 404

    quiz = Quiz.objects(id=quiz_id, teacher=teacher).first()
    if not quiz:
        return jsonify(error="Quiz not found"), 404

    quiz.delete()
    return jsonify(message="Quiz deleted"), 200


@teacher_blueprint.route('/groups', methods=['GET'])
@cross_origin()
@jwt_required()
@teacher_required
def get_groups():
    teacher_username = get_jwt_identity()
    
    teacher = User.objects(username=teacher_username).first()
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    groups = Group.objects(teacher_id=teacher.id)
    return jsonify([group.serialize() for group in groups]), 200


@teacher_blueprint.route('/groups', methods=['POST'])
@cross_origin()
@jwt_required()
@teacher_required
def create_group():
    data = json.loads(request.data)
    name = data.get('name')
    students_data = data.get('students', [])
    teacher_username = get_jwt_identity()

    if not name:
        return jsonify(error="Name is required"), 400

    teacher = User.objects(username=teacher_username).first()
    if not teacher:
        return jsonify(error="Teacher not found"), 404

    group = Group(name=name, teacher_id=teacher)
    group.save()

    # Legg til studenter i gruppen
    for student_username in students_data:
        student = User.objects(username=student_username).first()
        if student:
            group.students.append(student)
            student.groups.append(group)
            student.save()
        else:
            print(f"Student not found: {student_username}")

    group.save()

    return jsonify(success="Group created", group=group.serialize()), 201


@teacher_blueprint.route('/groups/<group_id>', methods=['DELETE'])
@cross_origin()
@jwt_required()
@teacher_required
def delete_group(group_id):
    teacher_id = get_jwt_identity()
    teacher = User.objects(username=teacher_id).first()

    if not teacher:
        return jsonify(error="Teacher not found"), 404

    group = Group.objects(id=group_id, teacher_id=teacher).first()
    if not group:
        return jsonify(error="Group not found"), 404

    group.delete()
    return jsonify(success="Group deleted"), 200

@teacher_blueprint.route('/leaderboard/individual', methods=['GET'])
@cross_origin()
@jwt_required()
@teacher_required
def get_individual_leaderboard():
    user_id = session["user_id"]
    quizzes = Quiz.query.filter_by(creator_id=user_id).all()
    leaderboard = []

    for quiz in quizzes:
        quiz_results = []

        for response in quiz.responses:
            quiz_results.append({
                'user_id': str(response.user_id.id),
                'username': response.user_id.username,
                'score': response.calculate_score()
            })

        leaderboard.append({
            'quiz_id': str(quiz.id),
            'quiz_name': quiz.name,
            'results': quiz_results
        })

    return jsonify(leaderboard), 200

@teacher_blueprint.route('/leaderboard/group', methods=['GET'])
@cross_origin()
@jwt_required()
@teacher_required
def get_group_leaderboard():
    user_id = session["user_id"]
    groups = Group.query.filter_by(creator_id=user_id).all()
    leaderboard = []

    for group in groups:
        group_results = []

        for quiz in group.quizzes:
            group_results.append({
                'quiz_id': str(quiz.id),
                'quiz_name': quiz.name,
                'score': quiz.calculate_group_score()
            })

        leaderboard.append({
            'group_id': str(group.id),
            'group_name': group.name,
            'results': group_results
        })

    return jsonify(leaderboard), 200



@teacher_blueprint.route('/students', methods=['GET'])
@cross_origin()
@jwt_required()
@teacher_required
def get_all_students():
    students = User.query.filter_by(role='student').all()
    return jsonify([student.serialize() for student in students]), 200




@teacher_blueprint.route('/groups/<group_id>', methods=['GET'])
@cross_origin()
@jwt_required()
@teacher_required
def get_group(group_id):
    teacher_username = get_jwt_identity()

    teacher = User.objects(username=teacher_username).first()
    if not teacher:
        return jsonify(error="Teacher not found"), 404

    group = Group.objects(id=group_id, teacher_id=teacher).first()
    if not group:
        return jsonify(error="Group not found"), 404

    return jsonify(group.serialize()), 200

@teacher_blueprint.route('/quiz/<quiz_id>', methods=['GET'])
@cross_origin()
@jwt_required()
@teacher_required
def get_quiz(quiz_id):
    teacher_id = get_jwt_identity()

    teacher = User.objects(username=teacher_id).first()
    if not teacher:
        return jsonify(error="Teacher not found"), 404

    quiz = Quiz.objects(id=quiz_id, teacher=teacher).first()
    if not quiz:
        return jsonify(error="Quiz not found"), 404

    return jsonify(quiz.serialize()), 200



# ... (additional teacher-related routes)
