from flask import Blueprint, request, jsonify
from app.models import Quiz, Question, Answer, Group
from app.database import db
from utils.decorators import teacher_required

quiz_blueprint = Blueprint('quiz', __name__)

@quiz_blueprint.route('/create', methods=['POST'])
@teacher_required
def create_quiz():
    data = request.json
    name = data.get('name')
    questions_data = data.get('questions')
    group_id = data.get('group_id')

    if not name or not questions_data or group_id is None:
        return jsonify(error="All fields are required"), 400

    quiz = Quiz(name=name, group_id=group_id)
    db.session.add(quiz)

    for question_data in questions_data:
        text = question_data.get('text')
        options = question_data.get('options')
        answer = question_data.get('answer')
        question = Question(text=text, options=options, answer=answer, quiz_id=quiz.id)
        quiz.questions.append(question)

    db.session.commit()
    return jsonify(quiz.serialize()), 201

@quiz_blueprint.route('/update/<quiz_id>', methods=['PUT'])
@teacher_required
def update_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify(error="Quiz not found"), 404

    data = request.json
    name = data.get('name')
    questions_data = data.get('questions')

    if name is not None:
        quiz.name = name

    if questions_data is not None:
        quiz.questions = []
        for question_data in questions_data:
            text = question_data.get('text')
            options = question_data.get('options')
            answer = question_data.get('answer')
            question = Question(text=text, options=options, answer=answer, quiz_id=quiz.id)
            quiz.questions.append(question)

    db.session.commit()
    return jsonify(quiz.serialize()), 200

@quiz_blueprint.route('/delete/<quiz_id>', methods=['DELETE'])
@teacher_required
def delete_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify(error="Quiz not found"), 404

    db.session.delete(quiz)
    db.session.commit()
    return jsonify(success=True), 200

@quiz_blueprint.route('/get/<quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify(error="Quiz not found"), 404

    return jsonify(quiz.serialize()), 200

@quiz_blueprint.route('/get_all', methods=['GET'])
def get_all_quizzes():
    quizzes = Quiz.query.all()
    return jsonify([quiz.serialize() for quiz in quizzes]), 200

