import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGroups } from "../../services/api";
import "./Group.css";

const GroupList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  return (
    <div className="group-list">
      <h2>Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={`/group/${group.id}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/group/create">Create Group</Link>
    </div>
  );
};

export default GroupList;
