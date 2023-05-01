from datetime import datetime
from app.database import db

class QuizAttempt(db.Document):
    quiz = db.ReferenceField("Quiz", required=True)
    student = db.ReferenceField("User")
    group = db.ReferenceField("Group")
    start_time = db.DateTimeField(default=datetime.utcnow)
    end_time = db.DateTimeField()  # will be None if the quiz is still ongoing
    score = db.IntField(default=0)
    completed = db.BooleanField(default=False)

    def serialize(self):
        return {
            "id": str(self.id),
            "quiz": self.quiz.serialize(),
            "student": self.student.serialize() if self.student else None,
            "group": self.group.serialize() if self.group else None,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "score": self.score,
            "completed": self.completed
        }

    def __repr__(self):
        return f"<QuizAttempt {self.id}>"
