from datetime import datetime
from os import abort
from flask import Blueprint, request, jsonify, session
from flask_mqtt import Mqtt
from app.models import Quiz, QuizAttempt, Answer, Group, User, Question, GroupQuiz
from app.database import db
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.decorators import student_required
from mongoengine import ValidationError, DoesNotExist


mqtt = Mqtt()

student_blueprint = Blueprint('student', __name__)

@student_blueprint.route("/quizzes/<quiz_id>", methods=["GET"])
@cross_origin()
@jwt_required()
@student_required
def get_quiz(quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except (ValidationError, DoesNotExist):
        return jsonify(error="Quiz not found"), 404
    
    return jsonify(quiz.serialize()), 200

# The top part of the file remains the same

@student_blueprint.route("/quizzes/<quiz_id>/access", methods=["POST"])
@cross_origin()
@jwt_required()
@student_required
def check_access(quiz_id):
    data = request.get_json()
    access_code = data.get('access_code', None)
    quiz = Quiz.objects.get_or_404(id=quiz_id)

    if quiz.access_code != access_code:
        return jsonify({"message": "Invalid access code"}), 403

    return jsonify({"message": "Access granted"}), 200


@student_blueprint.route("/quizzes/<quiz_id>/start", methods=["POST"])
@cross_origin()
@jwt_required()
@student_required
def start_quiz(quiz_id):
    student_id = get_jwt_identity()
    student = User.objects(username=student_id).first()
    quiz = Quiz.objects.get_or_404(id=quiz_id)
    existing_attempt = QuizAttempt.objects(quiz=quiz, student=student.id, completed=False).first()

    if existing_attempt:
        if not existing_attempt.end_time:
            remaining_time = int((quiz.time_limit * 60) - (datetime.utcnow() - existing_attempt.start_time).total_seconds())
            if remaining_time <= 0:
                # If the quiz time limit has passed, mark it as completed
                existing_attempt.completed = True
                existing_attempt.save()
                return jsonify({"message": "Time's up! Quiz has been auto-submitted"}), 200
            else:
                return jsonify({"message": "Quiz already started", "attempt": existing_attempt.serialize(), "remaining_time": remaining_time}), 200

    attempt = QuizAttempt(quiz=quiz, student=student.id, start_time=datetime.utcnow())
    attempt.save()

    return jsonify({"message": "Quiz started", "attempt": attempt.serialize(), "remaining_time": quiz.time_limit * 60}), 200


@student_blueprint.route("/quizzes/<quiz_id>/submit", methods=["POST"])
@cross_origin()
@jwt_required()
@student_required
def submit_quiz(quiz_id):
    data = request.get_json()
    attempt_id = data.get("attempt_id", None)
    answers_data = data.get("answers", [])
    quiz = Quiz.objects.get_or_404(id=quiz_id)

    if not attempt_id or not answers_data:
        return jsonify({"message": "Missing attempt id or answers"}), 400

    attempt = QuizAttempt.objects.get_or_404(id=attempt_id)

    # Delete old answers
    Answer.objects(quiz_attempt_id=attempt_id).delete()

    # Save new answers
    for answer_data in answers_data:
        question = Question.objects.get_or_404(id=answer_data["question_id"])
        answer = Answer(quiz_attempt_id=attempt.id, question_id=question.id, option=answer_data["option"])
        answer.save()

    # Calculate score
    total_questions = len(quiz.questions)
    correct_answers = 0
    for answer in Answer.objects(quiz_attempt_id=attempt.id):
        if answer.option == answer.question_id.answer:
            correct_answers += 1

    score = correct_answers / total_questions * 100

    attempt.score = score
    attempt.completed = True
    attempt.end_time = datetime.utcnow()
    attempt.save()

    return jsonify({"message": "Quiz submitted", "attempt": attempt.serialize(), "score": score}), 200

@student_blueprint.route("/quizzes/<quiz_id>/submit-answer", methods=["POST"])
@cross_origin()
@jwt_required()
@student_required
def submit_answer(quiz_id):
    data = request.get_json()
    attempt_id = data.get("attempt_id", None)
    question_id = data.get("question_id", None)
    option = data.get("option", None)

    if not attempt_id or not question_id or option is None:
        return jsonify({"message": "Missing attempt id, question id or option"}), 400

    attempt = QuizAttempt.objects.get_or_404(id=attempt_id)
    question = Question.objects.get_or_404(id=question_id)
    answer = Answer(quiz_attempt_id=attempt.id, question_id=question.id, option=option)
    answer.save()

    return jsonify({"message": "Answer submitted", "answer": answer.serialize()}), 200

@student_blueprint.route("/quizzes/<quiz_id>/finish", methods=["POST"])
@cross_origin()
@jwt_required()
@student_required
def finish_quiz(quiz_id):
    data = request.get_json()
    attempt_id = data.get("attempt_id", None)

    if not attempt_id:
        return jsonify({"message": "Missing attempt id"}), 400

    attempt = QuizAttempt.objects.get_or_404(id=attempt_id)
    attempt.completed = True
    attempt.end_time = datetime.utcnow()
    attempt.save()

    return jsonify({"message": "Quiz finished", "attempt": attempt.serialize()}), 200


@student_blueprint.route("/quizzes/<quiz_id>/results", methods=["GET"])
@cross_origin()
@jwt_required()
@student_required
def get_results(quiz_id):
    student_id = get_jwt_identity()
    student = User.objects(username=student_id).first()
    quiz = Quiz.objects.get_or_404(id=quiz_id)

    attempt = QuizAttempt.objects(quiz=quiz, student=student.id, completed=True).first()
    if not attempt:
        return jsonify({"message": "No completed quiz found"}), 404

    if attempt.end_time is not None:
        time_spent = int((attempt.end_time - attempt.start_time).total_seconds())
    else:
        time_spent = None 

    # Fetch student's answers
    answers = Answer.objects(quiz_attempt_id=attempt.id)
    question_results = []

    # Prepare question results
    for answer in answers:
        question = answer.question_id  # Removed the get_or_404 here
        is_correct = answer.option == question.answer
        question_results.append({
            'text': question.text,
            'yourAnswer': answer.option,
            'correctAnswer': question.answer,
            'isCorrect': is_correct
        })

    return jsonify({
        "message": "Quiz results", 
        "attempt": attempt.serialize(), 
        "score": attempt.score, 
        "time_spent": time_spent, 
        "questions": question_results
    }), 200


@student_blueprint.route("/quizzes/<quiz_id>/status", methods=["GET"])
@cross_origin()
@jwt_required()
@student_required
def get_quiz_status(quiz_id):
    student_id = get_jwt_identity()
    student = User.objects(username=student_id).first()
    quiz = Quiz.objects.get_or_404(id=quiz_id)

    attempt = QuizAttempt.objects(quiz=quiz, student=student.id).order_by('-start_time').first()
    if not attempt:
        return jsonify({"status": "not_started"}), 200

    if attempt.completed:
        return jsonify({"status": "completed"}), 200

    return jsonify({"status": "started"}), 200



@student_blueprint.route('/quizzes', methods=['GET'])
@cross_origin()
@jwt_required()
@student_required
def get_quizzes():
    quizzes = Quiz.objects().all()
    return jsonify([quiz.serialize() for quiz in quizzes]), 200


@student_blueprint.route('/group-quizzes', methods=['GET'])
@cross_origin()
@jwt_required()
@student_required
def get_group_quizzes():
    quizzes = Quiz.objects().all()
    return jsonify([quiz.serialize() for quiz in quizzes]), 200


@student_blueprint.route("/group-quizzes/<quiz_id>/start", methods=["POST"])
@cross_origin()
@jwt_required()
@student_required
def start_group_quiz(quiz_id):
    student_id = get_jwt_identity()
    student = User.objects(username=student_id).first()
    quiz = Quiz.objects.get_or_404(id=quiz_id)
    group = Group.objects(students=student).first()

    if group is None or student not in group.students:
        return jsonify({"message": "Student is not a part of this group"}), 403

    existing_attempt = QuizAttempt.objects(quiz=quiz, group=group, completed=False).first()

    if existing_attempt:
        remaining_time = int((quiz.time_limit * 60) - (datetime.utcnow() - existing_attempt.start_time).total_seconds())
        if remaining_time <= 0:
            existing_attempt.completed = True
            existing_attempt.save()
            return jsonify({"message": "Time's up! Quiz has been auto-submitted"}), 200
        else:
            return jsonify({"message": "Quiz already started", "attempt": existing_attempt.serialize(), "remaining_time": remaining_time}), 200

    attempt = QuizAttempt(quiz=quiz, group=group, start_time=datetime.utcnow())
    attempt.save()

    return jsonify({"message": "Quiz started", "attempt": attempt.serialize(), "remaining_time": quiz.time_limit * 60}), 200

@student_blueprint.route("/group-quizzes/<quiz_id>/submit-answer", methods=["POST"])
@cross_origin()
@jwt_required()
@student_required
def submit_group_answer(quiz_id):
    data = request.get_json()
    attempt_id = data.get("attempt_id", None)
    question_id = data.get("question_id", None)
    option = data.get("option", None)

    if not attempt_id or not question_id or option is None:
        return jsonify({"message": "Missing attempt id, question id or option"}), 400

    attempt = QuizAttempt.objects.get_or_404(id=attempt_id)
    question = Question.objects.get_or_404(id=question_id)
    answer = Answer(quiz_attempt=attempt, question=question, option=option)
    answer.save()

    if answer.option == question.answer:
        attempt.score += 1
        attempt.save()

    mqtt.publish(f'group-quizzes/{quiz_id}', f'Student {attempt.student.username} answered a question')

    return jsonify({"message": "Answer submitted", "answer": answer.serialize()}), 200

@student_blueprint.route("/group-quizzes/<quiz_id>/finish", methods=["POST"])
@cross_origin()
@jwt_required()
@student_required
def finish_group_quiz(quiz_id):
    data = request.get_json()
    attempt_id = data.get("attempt_id", None)

    if not attempt_id:
        return jsonify({"message": "Missing attempt id"}), 400

    attempt = QuizAttempt.objects.get_or_404(id=attempt_id)
    attempt.completed = True
    attempt.end_time = datetime.utcnow()
    attempt.save()

    return jsonify({"message": "Quiz finished", "attempt": attempt.serialize()}), 200

@student_blueprint.route("/group-quizzes/<quiz_id>/results", methods=["GET"])
@cross_origin()
@jwt_required()
@student_required
def get_group_results(quiz_id):
    student_id = get_jwt_identity()
    student = User.objects(username=student_id).first()
    quiz = GroupQuiz.objects.get_or_404(id=quiz_id)
    group = Group.objects(students=student).first()

    attempt = QuizAttempt.objects(quiz=quiz, group=group, completed=True).first()
    if not attempt:
        return jsonify({"message": "No completed quiz found"}), 404

    if attempt.end_time is not None:
        time_spent = int((attempt.end_time - attempt.start_time).total_seconds())
    else:
        time_spent = None 

    answers = Answer.objects(quiz_attempt=attempt)
    question_results = []

    for answer in answers:
        question = Question.objects.get_or_404(id=answer.question.id)
        is_correct = answer.option == question.answer
        question_results.append({
            'text': question.text,
            'yourAnswer': answer.option,
            'correctAnswer': question.answer,
            'isCorrect': is_correct
        })

    result = {
        'quizTitle': quiz.title,
        'score': attempt.score,
        'totalQuestions': quiz.questions.count(),
        'timeSpent': time_spent,
        'questions': question_results
    }

    return jsonify(result), 200

@student_blueprint.route("/group-quizzes/<quiz_id>/status", methods=["GET"])
@cross_origin()
@jwt_required()
@student_required
def get_group_quiz_status(quiz_id):
    student_id = get_jwt_identity()
    student = User.objects(username=student_id).first()
    quiz = Quiz.objects.get_or_404(id=quiz_id)
    group = Group.objects(students=student).first()

    if student not in group.students:
        return jsonify({"message": "You are not a member of this group"}), 403

    attempt = QuizAttempt.objects(quiz=quiz, group=group.id).order_by('-start_time').first()

    if not attempt:
        return jsonify({"status": "not_started"}), 200

    if attempt.completed:
        return jsonify({"status": "completed"}), 200

    return jsonify({"status": "started"}), 200

@student_blueprint.route("/group-quizzes/<quiz_id>", methods=["GET"])
@cross_origin()
@jwt_required()
@student_required
def get_group_quiz(quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except (ValidationError, DoesNotExist):
        return jsonify(error="Quiz not found"), 404
    
    return jsonify(quiz.serialize()), 200



# ... (additional student-related routes)
