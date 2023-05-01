import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { createQuestion } from "../../services/api";
import "./Question.css";

const QuestionCreate = () => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const { quizId } = useParams();
  const history = useHistory();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      text: questionText,
      options: options,
      answer: answer,
      quiz_id: quizId,
    };
    await createQuestion(data);
    history.push(`/quiz/${quizId}`);
  };

  return (
    <div className="question-create">
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="question-text">Question Text:</label>
        <input
          type="text"
          id="question-text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
        <label>Options:</label>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
          />
        ))}
        <label htmlFor="answer">Correct Answer:</label>
        <input
          type="text"
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default QuestionCreate;
