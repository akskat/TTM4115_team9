from datetime import datetime
from app.database import db

class Quiz(db.Document):
    name = db.StringField(required=True)
    teacher = db.ReferenceField("User", required=True)
    access_code = db.StringField(required=True, unique=True)
    time_limit = db.IntField(default=20)  # 20 minutes, default value
    created_at = db.DateTimeField(default=datetime.utcnow)
    questions = db.ListField(db.ReferenceField("Question"))

    def serialize(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "teacher": str(self.teacher.id),
            "access_code": self.access_code,
            "time_limit": self.time_limit,
            "created_at": self.created_at.isoformat(),
            "questions": [question.serialize() for question in self.questions]
        }

    def __repr__(self):
        return f"<Quiz {self.name}>"
