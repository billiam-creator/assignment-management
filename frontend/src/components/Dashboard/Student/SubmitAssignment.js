import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SubmitAssignment() {
  const { assignmentId } = useParams();
  const [solution, setSolution] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/assignments/${assignmentId}/submissions`, { solution });
      setSolution('');
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    }
  };

  return (
    <div>
      <h2>Submit Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="solution">Solution:</label>
          <textarea
            id="solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SubmitAssignment;
