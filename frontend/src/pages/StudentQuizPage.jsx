import React, { useState } from "react";
import "./StudentQuizPage.css";

const individualQuizzes = [
  { id: 1, name: "RAT 1" },
  { id: 2, name: "RAT 2" },
  { id: 3, name: "RAT 3" },
  { id: 4, name: "RAT 4" },
];

const groupQuizzes = [
  { id: 1, name: "Group RAT 1" },
  { id: 2, name: "Group RAT 2" },
  { id: 3, name: "Group RAT 3" },
  { id: 4, name: "Group RAT 4" },
];

const StudentQuizPage = () => {
  const [quizCode, setQuizCode] = useState("");
  const [showQuizCodePopup, setShowQuizCodePopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState("individual");

  const handleQuizClick = (quizId) => {
    // Open popup window to input quiz code
    setShowQuizCodePopup(true);
  };

  const handleQuizCodeSubmit = (event) => {
    event.preventDefault();
    // TODO: Send quiz code to server via MQTT
    console.log(`Quiz Code: ${quizCode}`);
    setShowQuizCodePopup(false);
  };

  const handlePopupClose = () => {
    setShowQuizCodePopup(false);
  };

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logging out...");
  };

  return (
    <div className="student-quiz-page-container">
      <div className="header">
        <h1>Available RATs</h1>
        <button className={"logout-button"} onClick={handleLogout}>
          Log Out
        </button>
      </div>
      <div className="tab-buttons">
        <button
          className={selectedTab === "individual" ? "active" : ""}
          onClick={() => handleTabClick("individual")}
        >
          Individual RATs
        </button>
        <button
          className={selectedTab === "group" ? "active" : ""}
          onClick={() => handleTabClick("group")}
        >
          Group RATs
        </button>
      </div>
      <div className="quiz-list">
        {selectedTab === "individual"
          ? individualQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-item"
                onClick={() => handleQuizClick(quiz.id)}
              >
                {quiz.name}
              </div>
            ))
          : groupQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-item"
                onClick={() => handleQuizClick(quiz.id)}
              >
                {quiz.name}
              </div>
            ))}
      </div>
      {showQuizCodePopup && (
        <div className="quiz-code-popup">
          <div className="quiz-code-popup-content">
            <span className="quiz-code-popup-close" onClick={handlePopupClose}>
              &times;
            </span>
            <form onSubmit={handleQuizCodeSubmit}>
              <label>
                Quiz Code:
                <input
                  type="text"
                  value={quizCode}
                  onChange={(event) => setQuizCode(event.target.value)}
                />
              </label>
              <button type="submit">Start Quiz</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuizPage;