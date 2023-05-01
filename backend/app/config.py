from datetime import timedelta
import os

class Config:
    MONGODB_SETTINGS = {
        'db': 'QuizAppDB',
        'host': os.environ.get('MONGODB_URI')
    }
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
