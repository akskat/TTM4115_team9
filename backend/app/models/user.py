from datetime import datetime
from app.database import db
from mongoengine import Document, StringField, ReferenceField, ListField

class User(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)
    role = db.StringField(required=True, choices=["teacher", "student"])
    created_at = db.DateTimeField(default=datetime.utcnow)
    groups = ListField(ReferenceField('Group'))


    def serialize(self):
        return {
            "id": str(self.id),
            "username": self.username,
            "password": self.password,
            "role": self.role,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "groups": [str(group.id) for group in self.groups] if self.groups else []
        }

    def is_teacher(self):
        return self.role == "teacher"

    def is_student(self):
        return self.role == "student"

    def __repr__(self):
        return f"<User {self.username}>"
