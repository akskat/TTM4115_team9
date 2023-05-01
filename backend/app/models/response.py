from app.database import db

class Response(db.Document):
    user_id = db.ReferenceField("User", required=True)
    quiz_id = db.ReferenceField("Quiz", required=True)
    answers = db.ListField(db.ReferenceField("Answer"))

    def serialize(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id.id),
            "quiz_id": str(self.quiz_id.id),
            "answers": [answer.serialize() for answer in self.answers]
        }

    def __repr__(self):
        return f"<Response {self.id}>"
