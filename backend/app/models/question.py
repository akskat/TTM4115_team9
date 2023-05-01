from app.database import db

class Question(db.Document):
    text = db.StringField(required=True)
    options = db.ListField(db.StringField(), required=True)
    answer = db.StringField(required=True)

    def serialize(self):
        return {
            "id": str(self.id),
            "text": self.text,
            "options": self.options,
            "answer": self.answer,
        }

    def __repr__(self):
        return f"<Question {self.text}>"

