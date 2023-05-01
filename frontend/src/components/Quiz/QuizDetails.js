import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, deleteQuiz } from "../../services/api";
import "./Quiz.css";

const QuizDetails = () => {
  const [quiz, setQuiz] = useState(null);
  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    const data = await getQuiz(quizId);
    setQuiz(data);
  };

  const handleDelete = async () => {
    const success = await deleteQuiz(quizId);
    if (success) {
      navigate("/teacher");
    } else {
      // Handle error
    }
  };

  return (
    <div className="quiz-details">
      {quiz ? (
        <>
          <h2>{quiz.name}</h2>
          <p>Access Code: {quiz.access_code}</p>
          <p>Time Limit: {quiz.time_limit} minutes</p>
          <h3>Questions:</h3>
          {quiz.questions.map((question, index) => (
            <div key={index} className="quiz-question">
              <h4>{question.text}</h4>
              <p>Options: {question.options.join(", ")}</p>
              <p>Answer: {question.options[question.answer]}</p>
            </div>
          ))}
          <button onClick={handleDelete}>Delete</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QuizDetails;
