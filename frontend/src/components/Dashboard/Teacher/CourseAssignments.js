import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseAssignments() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/teachers/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleCreateAssignment = async () => {
    try {
      await axios.post(`/api/courses/${selectedCourse.id}/assignments`, {
        title,
        description,
        dueDate,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      // Update the local state or fetch the updated data
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  return (
    <div className="course-assignments-container">
      <h2>Course Assignments</h2>
      <div className="form-group">
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
        <div className="assignment-form">
          <h3>Create Assignment</h3>
          <form onSubmit={handleCreateAssignment}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date:</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="create-assignment-button">
              Create Assignment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CourseAssignments;
