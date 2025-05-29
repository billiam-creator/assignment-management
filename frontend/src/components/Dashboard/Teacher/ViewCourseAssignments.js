import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ViewCourseAssignments() {
    const { courseId } = useParams();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/teachers/courses/${courseId}/assignments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAssignments(response.data);
            } catch (err) {
                setError('Failed to fetch assignments.');
                console.error('Error fetching assignments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [courseId]);

    if (loading) {
        return <div>Loading assignments...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Assignments for Course {courseId}</h2>
            <Link to={`/teacher/course/${courseId}/assignments/create`}>Create New Assignment</Link>
            <ul>
                {assignments.map(assignment => (
                    <li key={assignment._id}>
                        <Link to={`/teacher/assignment/${assignment._id}/submissions`}>{assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/teacher/dashboard">Back to Dashboard</Link>
        </div>
    );
}

export default ViewCourseAssignments;