from app.database import db

class Answer(db.Document):
    question_id = db.ReferenceField("Question", required=True)
    option = db.StringField(required=True)
    quiz_attempt_id = db.ReferenceField("QuizAttempt", required=True)

    def serialize(self):
        return {
            "id": str(self.id),
            "quiz_attempt_id": str(self.quiz_attempt_id.id),
            "question_id": str(self.question_id.id),
            "option": self.option
        }

    def __repr__(self):
        return f"<Answer {self.option}>"
