from app.database import db

class Group(db.Document):
    name = db.StringField(required=True)
    teacher_id = db.ReferenceField("User", required=True)
    students = db.ListField(db.ReferenceField("User"))
    quizzes = db.ListField(db.ReferenceField("GroupQuiz"))  # Added field

    def serialize(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "teacher_id": str(self.teacher_id.id),
            "students": [{"id": str(student.id), "name": student.username} for student in self.students],
            "quizzes": [quiz.serialize() for quiz in self.quizzes]  # Added serialization for quizzes
        }

    def __repr__(self):
        return f"<Group {self.name}>"
