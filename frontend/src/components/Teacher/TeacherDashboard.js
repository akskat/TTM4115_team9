import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGroups, getQuizzes, logout } from "../../services/api";
import "./TeacherDashboard.css";


export default function TeacherDashboard() {
  const [groups, setGroups] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const history = useNavigate(); // Use history for redirect

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      history("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const groupResponse = await getGroups();
      setGroups(groupResponse.data);

      const quizResponse = await getQuizzes();
      setQuizzes(quizResponse.data);
    }

    fetchData();
  }, []);

  return (
    <div className="teacher-dashboard">
      <button onClick={handleLogout} className="logout-button">Log out</button>
      <h2>Teacher Dashboard</h2>
      <div className="groups-section">
        <h3>Groups</h3>
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <Link to={`/teacher/groups/${group.id}`}>{group.name}</Link>
            </li>
          ))}
        </ul>
        <div className="groups-create-section"><Link to="/groups/create">Create New Group</Link></div>
        
      </div>
      <div className="quizzes-section">
        <h3>Quizzes</h3>
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <Link to={`/teacher/quizzes/${quiz.id}`}>{quiz.name}</Link>
            </li>
          ))}
        </ul>
        
        <div className="quizzes-create-section">
          <Link to="/quiz/create">Create New Quiz</Link>
        </div>
      </div>
    </div>
  );
}  
