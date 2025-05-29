import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function CreateAssignment() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/teachers/courses/${courseId}/assignments`, {
                title,
                description,
                dueDate,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Assignment created successfully!');
            navigate(`/teacher/course/${courseId}/assignments`); // Redirect to view assignments
        } catch (err) {
            setError('Failed to create assignment.');
            console.error('Error creating assignment:', err);
            toast.error('Failed to create assignment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create New Assignment for Course {courseId}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        cols="50"
                    />
                </div>
                <div>
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>Create Assignment</button>
                {loading && <div>Creating...</div>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <Link to={`/teacher/course/${courseId}/assignments`}>Back to Assignments</Link>
        </div>
    );
}

export default CreateAssignment;