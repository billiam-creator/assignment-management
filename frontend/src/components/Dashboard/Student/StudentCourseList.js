import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentCourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/students/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>You are not enrolled in any courses yet.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentCourseList;
