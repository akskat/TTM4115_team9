import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../services/api";
import { handleInputChange } from "../../utils/helpers";
import "./Auth.css";

export default function Register() {
  const [state, setState] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(state.username, state.password, state.role);
      alert("Registration successful");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
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
        <label htmlFor="role">Role</label>
        <select
          name="role"
          value={state.role}
          onChange={(event) => handleInputChange(event, state, setState)}
        >
          <option value="">Select role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <Link to="/">
          Already have a user? Sign in here
      </Link>
    </div>
  );
}
