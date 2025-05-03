import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClassList.css';

function ClassList({ classes: propClasses }) {
  const [classes, setClasses] = useState(propClasses || []);
  const [teacherId, setTeacherId] = useState('teacher123'); // Example teacher ID

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`/api/teachers/${teacherId}/classes`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };

    fetchClasses();
  }, [teacherId]);

  return (
    <div className="class-list-container">
      <h2>Your Classes</h2>
      {classes.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        <ul>
          {classes.map(cls => (
            <li key={cls._id} className="class-item">
              <Link to={`/teacher/classes/${cls._id}/assignments`}>{cls.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClassList;