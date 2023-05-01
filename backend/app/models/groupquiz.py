from app.database import db

class GroupQuiz(db.Document):
    title = db.StringField(required=True)
    questions = db.ListField(db.ReferenceField("Question"))
    group = db.ReferenceField("Group", required=True, reverse_delete_rule=db.CASCADE)  # Added reverse_delete_rule
    access_code = db.StringField(required=True)
    time_limit = db.IntField(required=True)  # time limit in minutes

    def serialize(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "questions": [question.serialize() for question in self.questions],
            "group": str(self.group.id) if self.group else None,  # Changed to just the group ID
            "access_code": self.access_code,
            "time_limit": self.time_limit,
        }

    def __repr__(self):
        return f"<GroupQuiz {self.title}>"
