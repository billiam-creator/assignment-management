import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherAssignment() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get('/api/courses');
        setCourses(coursesResponse.data);

        const teachersResponse = await axios.get('/api/teachers');
        setTeachers(teachersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    try {
      await axios.post(`/api/courses/${selectedCourse.id}/teachers/${selectedTeacher.id}`);
      // Update the local state or fetch the updated data
    } catch (error) {
      console.error('Error assigning teacher:', error);
    }
  };

  return (
    <div>
      <h2>Assign Teachers to Courses</h2>
      <div>
        <label htmlFor="course">Course:</label>
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
      <div>
        <label htmlFor="teacher">Teacher:</label>
        <select
          id="teacher"
          value={selectedTeacher?.id || ''}
          onChange={(e) => setSelectedTeacher(teachers.find(teacher => teacher.id === e.target.value))}
        >
          <option value="">Select a teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleAssign}>Assign Teacher</button>
    </div>
  );
}

export default TeacherAssignment;
