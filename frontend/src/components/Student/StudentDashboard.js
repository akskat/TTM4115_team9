import React from "react";
import "./StudentDashboard.css";
import QuizList from "./QuizList";

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <h2>Welcome to your Student Dashboard</h2>
      <div className="student-actions">
        <QuizList />
      </div>
    </div>
  );
};

export default StudentDashboard;
