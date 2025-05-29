import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function GradeSubmission({ submissionId, onClose }) {
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/teachers/submissions/${submissionId}/grade`, { grade, feedback }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Submission graded successfully!');
            onClose(); // Close the grading component
        } catch (err) {
            setError('Failed to grade submission.');
            console.error('Error grading submission:', err);
            toast.error('Failed to grade submission.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>Grade Submission</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="grade">Grade:</label>
                    <input
                        type="text"
                        id="grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="feedback">Feedback:</label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows="3"
                        cols="50"
                    />
                </div>
                <button type="submit" disabled={loading}>Submit Grade</button>
                {loading && <div>Grading...</div>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}

export default GradeSubmission;