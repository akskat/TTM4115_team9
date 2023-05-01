import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteGroup } from "../../services/api";
import "./Group.css";

const GroupDelete = ({ groupId }) => {
  const history = useNavigate();

  const handleDelete = async () => {
    await deleteGroup(groupId);
    history("/teacher/");
  };

  return (
    <button className="group-delete" onClick={handleDelete}>
      Delete Group
    </button>
  );
};

export default GroupDelete;
