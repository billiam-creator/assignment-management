import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseEnrollment() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollment = async () => {
    try {
      await axios.post(`/api/students/enroll/${selectedCourse.id}`);
      // Update the local state or fetch the updated data
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div>
      <h2>Course Enrollment</h2>
      <div>
        <label htmlFor="course">Select a Course:</label>
        <select
          id="course"
          value={selectedCourse?.id || ''}
          onChange={(e) => setSelectedCourse(courses.find(course => course.id === e.target.value))}
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      {selectedCourse && (
        <div>
          <h3>{selectedCourse.name}</h3>
          <p>{selectedCourse.description}</p>
          <button onClick={handleEnrollment}>Enroll</button>
        </div>
      )}
    </div>
  );
}

export default CourseEnrollment;
