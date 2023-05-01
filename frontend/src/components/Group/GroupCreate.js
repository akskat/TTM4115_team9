import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../services/api';
import './Group.css';

const GroupCreate = () => {
  const [groupName, setGroupName] = useState('');
  const [students, setStudents] = useState([]);
  const [studentUsername, setStudentUsername] = useState('');
  const history = useNavigate();

  const handleAddStudent = (e) => {
    e.preventDefault();
    setStudents([...students, studentUsername]);
    setStudentUsername('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGroup({
        name: groupName,
        students: students,
      });
      history('/teacher');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="group-create-container">
      <h2 className="group-create-header">Create Group</h2>
      <form className="group-create-form" onSubmit={handleSubmit}>
        <label className="group-create-label" htmlFor="groupName">Group Name:</label>
        <input
          className="group-create-input"
          type="text"
          id="groupName"
          name="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <br />
        <div className="group-create-students-container">
          <label className="group-create-label" htmlFor="studentUsername">Student brukernavn:</label>
          <input
            className="group-create-input"
            type="text"
            id="studentUsername"
            name="studentUsername"
            value={studentUsername}
            onChange={(e) => setStudentUsername(e.target.value)}
          />
          <button className="group-create-add-button" onClick={handleAddStudent}>Legg til student</button>
          <ul className="group-create-students-list">
            {students.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        </div>
        <br />
        <button className="group-create-submit-button" type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default GroupCreate;
