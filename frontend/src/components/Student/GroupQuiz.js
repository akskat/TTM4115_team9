import React, { useEffect, useState } from 'react';
import { startGroupQuiz, submitGroupAnswer, finishGroupQuiz, getQuiz_group } from '../../services/api';
import { useParams } from 'react-router-dom';

function GroupQuiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);

  useEffect(() => {
    getQuiz_group(quizId)
      .then(quizData => {
        setQuiz(quizData);
        return startGroupQuiz(quizId);
      })
      .then(data => {
        setAttemptId(data.attemptId);
      });
  }, [quizId]);
  

  const submitAnswer = (questionId, option) => {
    submitGroupAnswer(attemptId, questionId, option, quizId)
      .then(data => {
        setQuiz(prevQuiz => {
          const newQuiz = { ...prevQuiz };
          const questionIndex = newQuiz.questions.findIndex(q => q.id === questionId);
          newQuiz.questions[questionIndex].state = data.question_state;
          return newQuiz;
        });
      });
  };

  const finishQuiz = () => {
    finishGroupQuiz(attemptId, quizId)
      .then(() => {
        // Redirect to the results page.
        // This is left for you to implement depending on your routing setup.
      });
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {quiz.questions.map(question => (
        <div key={question.id}>
          <h2>{question.text}</h2>
          {question.options.map((option, index) => (
            <div key={index}>
              <input 
                type="radio" 
                id={`option-${index}`} 
                name={question.id} 
                value={option}
                onClick={() => submitAnswer(question.id, option)} 
              />
              <label htmlFor={`option-${index}`}>{option.text}</label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={finishQuiz}>Finish Quiz</button>
    </div>
  );
}

export default GroupQuiz;
