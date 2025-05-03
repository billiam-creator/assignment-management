import React, { useState } from 'react';
import './CreateAssignmentForm.css';
import { useNavigate } from 'react-router-dom';

function CreateAssignmentForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [classId, setClassId] = useState('math101'); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId, title, description, dueDate }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('New assignment created:', result);
      alert('Assignment created!');
      navigate('/teacher'); 
    } catch (error) {
      console.error('Failed to create assignment:', error);
      alert('Failed to create assignment.');
    }
  };

  return (
    <div className="create-assignment-form-container">
      <h2>Create New Assignment</h2>
      <form onSubmit={handleSubmit}>
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
            rows="5"
          />
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
        {/* You might need a way to select the class ID dynamically */}
        {/* <div className="form-group">
          <label htmlFor="classId">Class:</label>
          <input
            type="text"
            id="classId"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          />
        </div> */}
        <button type="submit" className="create-button">Create Assignment</button>
        <Link to="/teacher" className="cancel-button">Cancel</Link>
      </form>
    </div>
  );
}

export default CreateAssignmentForm;