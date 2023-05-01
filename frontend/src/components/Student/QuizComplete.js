import React from 'react';
import { submitAnswer, finishQuiz } from '../../services/api'; 

const QuizComplete = ({ answers, quizId, attemptId }) => {
  const handleSubmit = async () => {
    for(let i = 0; i < answers.length; i++) {
      // Here, we'll assume each answer is an object with questionId and option properties
      await submitAnswer(attemptId, answers[i].questionId, answers[i].option, quizId);
    }
    await finishQuiz(attemptId, quizId);
  }

  return (
    <div>
      <h1>You've completed the quiz!</h1>
      <button onClick={handleSubmit}>Submit Answers</button>
    </div>
  );
}

export default QuizComplete;
