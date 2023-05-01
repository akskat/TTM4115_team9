import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import TeacherDashboard from "../Teacher/TeacherDashboard";
import StudentDashboard from "../Student/StudentDashboard";
import Quiz from "../Student/Quiz";
import GroupCreate from "../Group/GroupCreate";
import GroupList from "../Group/GroupList";
import GroupDetails from "../Group/GroupDetails";
import QuizCreate from "../Quiz/QuizCreate";
import QuizList from "../Quiz/QuizList";
import QuizDetails from "../Quiz/QuizDetails";
import PrivateRoute from '../Auth/PrivateRoute';
import QuizResults from "../Student/QuizResults";
import GroupQuiz from "../Student/GroupQuiz";


function App() {
  const [auth, setAuth] = useState(false);


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login setAuth={setAuth}/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/teacher" element={<PrivateRoute/>}>
            <Route path="/teacher" element={<TeacherDashboard/>} />
          </Route>
          <Route path="/student" element={<PrivateRoute/>}>
            <Route path="/student" element={<StudentDashboard/>} />
          </Route>
          <Route path="/groups/create" element={<PrivateRoute/>}>
            <Route path="/groups/create" element={<GroupCreate />} />
          </Route>
          <Route path="/teacher/groups" element={<PrivateRoute/>}>
            <Route path="/teacher/groups" element={<GroupList />} />
          </Route>
          <Route path="/teacher/groups/:groupId" element={<PrivateRoute/>}>
            <Route path="/teacher/groups/:groupId" element={<GroupDetails />} />
          </Route>
          <Route path="/quiz/create" element={<PrivateRoute/>}>
            <Route path="/quiz/create" element={<QuizCreate />} />
          </Route>
          <Route path="/teacher/quiz" element={<PrivateRoute/>}>
            <Route path="/teacher/quiz" element={<QuizList />} />
          </Route>
          <Route path="/teacher/quizzes/:quizId" element={<PrivateRoute/>}>
            <Route path="/teacher/quizzes/:quizId" element={<QuizDetails />} />
          </Route>
          <Route path="/student/quizzes/:quizId" element={<PrivateRoute/>}>
            <Route path="/student/quizzes/:quizId" element={<Quiz />} />
          </Route>
          <Route path="/results/:quizId" element={<PrivateRoute/>}>
            <Route path="/results/:quizId" element={<QuizResults />} />
          </Route>


          <Route path="/student/group-quizzes/:quizId" element={<PrivateRoute/>}>
            <Route path="/student/group-quizzes/:quizId" element={<GroupQuiz />} />
          </Route>
          <Route path="/results-group/:quizId" element={<PrivateRoute/>}>
            <Route path="/results-group/:quizId" element={<QuizResults />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
