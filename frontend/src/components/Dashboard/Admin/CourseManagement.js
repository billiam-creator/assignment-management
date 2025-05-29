import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_BASE_URL = 'http://localhost:5000/api/admin';
    const getAuthToken = useCallback(() => localStorage.getItem('token'), []);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                toast.error('Authentication token missing. Please log in again.');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/courses`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch courses: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message);
            toast.error('Failed to load courses.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, getAuthToken, toast]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="course-management">
            <h2>Course Management</h2>
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
                        {courses.map(course => (
                            <tr key={course._id}>
                                <td>{course.name}</td>
                                <td>{course.instructor ? course.instructor.username : 'N/A'}</td>
                                <td>
                                    {/* Add buttons for Edit/Delete Course */}
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No courses found.</p>
            )}
        </div>
    );
}

export default CourseManagement;