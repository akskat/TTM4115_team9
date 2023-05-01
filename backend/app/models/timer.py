from datetime import datetime
from app.database import db


class Timer(db.Document):
    quiz_attempt = db.ReferenceField("QuizAttempt", required=True)
    start_time = db.DateTimeField(default=datetime.utcnow)
    end_time = db.DateTimeField()  # will be None if the timer is still running

    def time_remaining(self):
        if self.end_time:
            return 0
        time_elapsed = datetime.utcnow() - self.start_time
        time_limit = self.quiz_attempt.quiz.time_limit
        return max(0, time_limit - time_elapsed.total_seconds())
