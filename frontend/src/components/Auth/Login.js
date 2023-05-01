import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { handleInputChange } from "../../utils/helpers";
import "./Auth.css";

export default function Login({ setAuth }) {
  const [state, setState] = useState({
    username: "",
    password: "",
    error: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(state.username, state.password);
      console.log("Login response:", response); // Legg til denne linjen for å logge responsen
      if (response.success) { 
        localStorage.setItem("token", response.access_token);
        setAuth(true);
        if (response.role === "student") {
          navigate("/student");
        } else if (response.role === "teacher") {
          navigate("/teacher");
        }
      } else {
        setState((prevState) => ({
          ...prevState,
          error: "Invalid username or password",
        }));
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setState((prevState) => ({
        ...prevState,
        error: "Invalid username or password",
      }));
    }
  };
  
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={(event) => handleInputChange(event, state, setState)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={(event) => handleInputChange(event, state, setState)}
        />
        <button type="submit">Login</button>
        {state.error && <p className="error">{state.error}</p>}
      </form>
      <Link to="/register">No user? Sign up here</Link>
    </div>
  );
}


