import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const authToken = localStorage.getItem('token');
    const API_BASE_URL = 'http://localhost:5000/api/admin';

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/courses`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                console.error('Failed to fetch courses:', response.status);
                setError('Failed to fetch courses.');
                toast.error('Failed to fetch courses.');
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Network error fetching courses.');
            toast.error('Network error fetching courses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchCourses();
        }
    }, [authToken]);

    if (loading) {
        return <p>Loading courses...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Course Management</h1>
            <h2>Existing Courses</h2>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Instructor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id}>
                                <td>{course.name}</td>
                                <td>{course.instructor ? course.instructor.username : 'N/A'}</td>
                                <td>
                                    {/* Add Edit/Delete buttons here */}
                                    <button className="action-button edit-button">Edit</button>
                                    <button className="action-button delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No courses available.</p>
            )}
        </div>
    );
}

export default CourseManagement;

