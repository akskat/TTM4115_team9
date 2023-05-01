import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGroup } from "../../services/api";
import GroupDelete from "./GroupDelete";
import "./Group.css";

const GroupDetails = () => {
  const [group, setGroup] = useState(null);
  const { groupId } = useParams();

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    const data = await getGroup(groupId);
    setGroup(data);
  };
  
  return (
    <div className="group-details-container">
      {group ? (
        <div className="group-details">
          <h2 className="group-details__title">{group.name}</h2>
          <div className="group-details__info">
            <p className="group-details__members">
              Members: {group.students.length}
            </p>
            <ul className="group-details__list">
              {group.students.map((student) => (
                <li key={student.id} className="group-details__item">
                  {student.name}
                </li>
              ))}
            </ul>
          </div>
          <GroupDelete groupId={groupId} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GroupDetails;
