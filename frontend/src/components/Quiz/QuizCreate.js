import React, { useState } from "react";
import { createQuiz } from "../../services/api";
import "./Quiz.css";

const QuizCreate = () => {
  const [quizName, setQuizName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [timeLimit, setTimeLimit] = useState(20);
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);
  

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const data = {
      name: quizName,
      access_code: quizCode,
      time_limit: timeLimit,
      questions: questions,
    };
    await createQuiz(data);
    setQuizName("");
    setQuizCode("");
    setTimeLimit(20);
    setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  const handleQuestionChange = (index, event) => {
    const values = [...questions];
    values[index].question = event.target.value;
    setQuestions(values);
  };

  const handleOptionChange = (index, subIndex, event) => {
    const values = [...questions];
    values[index].options[subIndex] = event.target.value;
    setQuestions(values);
  };

  const handleAnswerChange = (index, event) => {
    const values = [...questions];
    values[index].answer = event.target.value;
    setQuestions(values);
  };

  return (
    <div className="quiz-create">
      <h2>Create a Quiz</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="quiz-name">Quiz Name:</label>
        <input
          type="text"
          id="quiz-name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          required
        />

        <label htmlFor="quiz-code">Quiz Code (the code can not have been used before):</label>
        <input
          type="text"
          id="quiz-code"
          value={quizCode}
          onChange={(e) => setQuizCode(e.target.value)}
          required
        />

        <label htmlFor="time-limit">Time Limit (minutes):</label>
        <input
          type="number"
          id="time-limit"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          min="1"
          max="120"
          required
        />

        {questions.map((question, index) => (
          <div key={index}>
            <label htmlFor={`question-${index}`}>Question {index + 1}:</label>
            <input
              type="text"
              id={`question-${index}`}
              value={question.question}
              onChange={(event) => handleQuestionChange(index, event)}
              required
            />

            {question.options.map((option, subIndex) => (
              <div key={subIndex}>
                <label htmlFor={`option-${index}-${subIndex}`}>Option {subIndex + 1}:</label>
                <input
                  type="text"
                  id={`option-${index}-${subIndex}`}
                  value={option}
                  onChange={(event) => handleOptionChange(index, subIndex, event)}
                  required
                />
                <label>
                  <input
                    type="radio"
                    name={`answer-${index}`}
                    value={subIndex}
                    checked={question.answer === subIndex.toString()}
                    onChange={(event) => handleAnswerChange(index, event)}
                    required
                  />
                  Correct Answer
                  </label>
                </div>
              ))}
            </div>
          ))}
  
          <button type="button" onClick={addQuestion}>Add Question</button>
          <button type="submit">Create Quiz</button>
        </form>
      </div>
    );
  };
  
  export default QuizCreate;
  

