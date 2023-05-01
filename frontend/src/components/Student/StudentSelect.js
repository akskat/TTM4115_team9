import React from "react";

const StudentSelect = ({ students, selectedStudents, onStudentChange }) => {
  const handleChange = (e) => {
    onStudentChange(e.target.value, e.target.checked);
  };

  return (
    <div className="student-select">
      {students.map((student) => (
        <div key={student.id}>
          <input
            type="checkbox"
            id={`student-${student.id}`}
            value={student.id}
            checked={selectedStudents.includes(student.id)}
            onChange={handleChange}
          />
          <label htmlFor={`student-${student.id}`}>{student.name}</label>
        </div>
      ))}
    </div>
  );
};

export default StudentSelect;
