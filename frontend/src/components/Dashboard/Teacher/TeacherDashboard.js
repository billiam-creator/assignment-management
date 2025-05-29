import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeacherDashboard() {
    const navigate = useNavigate();
    const [teacherInfo, setTeacherInfo] = useState({ username: '' });
    const [myCourses, setMyCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '' });
    const [isAddingAssignment, setIsAddingAssignment] = useState(false);

    const API_BASE_URL = 'http://localhost:5000/api/teachers';
    const getAuthToken = () => localStorage.getItem('token');

    useEffect(() => {
        fetchTeacherInfo();
        fetchMyCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            fetchEnrolledStudents(selectedCourseId);
            fetchAssignments(selectedCourseId);
        } else {
            setEnrolledStudents([]);
            setAssignments([]);
        }
    }, [selectedCourseId]);

    const fetchTeacherInfo = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/info`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setTeacherInfo(data);
            } else {
                console.error('Failed to fetch teacher info');
                toast.error('Failed to fetch teacher info.');
            }
        } catch (error) {
            console.error('Error fetching teacher info:', error);
            toast.error('Error fetching teacher info.');
        }
    };

    const fetchMyCourses = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/courses`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setMyCourses(data);
            } else {
                console.error('Failed to fetch teacher\'s courses');
                toast.error('Failed to fetch your courses.');
            }
        } catch (error) {
            console.error('Error fetching teacher\'s courses:', error);
            toast.error('Error fetching your courses.');
        }
    };

    const handleCourseSelect = (event) => {
        setSelectedCourseId(event.target.value);
    };

    const fetchEnrolledStudents = async (courseId) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/students`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setEnrolledStudents(data);
            } else {
                console.error(`Failed to fetch students for course ${courseId}`);
                toast.error(`Failed to fetch students for this course.`);
            }
        } catch (error) {
            console.error(`Error fetching students for course ${courseId}:`, error);
            toast.error('Error fetching students.');
        }
    };

    const fetchAssignments = async (courseId) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/assignments`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                console.error(`Failed to fetch assignments for course ${courseId}`);
                toast.error('Failed to fetch assignments.');
            }
        } catch (error) {
            console.error(`Error fetching assignments for course ${courseId}:`, error);
            toast.error('Error fetching assignments.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAssignment({ ...newAssignment, [name]: value });
    };

    const handleAddAssignmentClick = () => {
        setIsAddingAssignment(true);
    };

    const handleCreateAssignment = async () => {
        if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate || !selectedCourseId) {
            toast.warn('Please fill in all assignment details and select a course.');
            return;
        }

        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/courses/${selectedCourseId}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newAssignment),
            });

            if (response.ok) {
                toast.success('Assignment created successfully!');
                setNewAssignment({ title: '', description: '', dueDate: '' });
                setIsAddingAssignment(false);
                fetchAssignments(selectedCourseId); // Refresh assignments list
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to create assignment.');
            }
        } catch (error) {
            console.error('Error creating assignment:', error);
            toast.error('Error creating assignment.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="teacher-dashboard">
            <div className="sidebar">
                <h2>Teacher Portal</h2>
                <ul>
                    <li className="active">Dashboard</li>
                    <li>My Courses</li>
                    <li>Assignments</li>
                    <li>Submissions</li>
                    <li>Logout</li>
                </ul>
            </div>
            <div className="content">
                <div className="header">
                    <h1>Teacher Dashboard</h1>
                    <p>Welcome, {teacherInfo.username || 'Teacher'}</p>
                </div>

                <div className="my-courses-section">
                    <h2>My Courses</h2>
                    {myCourses.length > 0 ? (
                        <select onChange={handleCourseSelect} value={selectedCourseId || ''}>
                            <option value="" disabled>Select a Course</option>
                            {myCourses.map((course) => (
                                <option key={course._id} value={course._id}>{course.name}</option>
                            ))}
                        </select>
                    ) : (
                        <p>You are not assigned to any courses yet.</p>
                    )}
                </div>

                {selectedCourseId && (
                    <>
                        <div className="enrolled-students-section">
                            <h2>Enrolled Students</h2>
                            {enrolledStudents.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrolledStudents.map((student) => (
                                            <tr key={student._id}>
                                                <td>{student.username}</td>
                                                <td>{student.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No students enrolled in this course yet.</p>
                            )}
                        </div>

                        <div className="assignments-section">
                            <h2>Assignments</h2>
                            {assignments.length > 0 ? (
                                <ul>
                                    {assignments.map((assignment) => (
                                        <li key={assignment._id}>
                                            {assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                            {/* Add options to view submissions, grade, etc. */}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No assignments created for this course yet.</p>
                            )}
                            {!isAddingAssignment ? (
                                <button onClick={handleAddAssignmentClick} className="add-button">Add New Assignment</button>
                            ) : (
                                <div className="add-assignment-form">
                                    <h3>Create New Assignment</h3>
                                    <div className="form-group">
                                        <label htmlFor="title">Title</label>
                                        <input type="text" id="title" name="title" value={newAssignment.title} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea id="description" name="description" value={newAssignment.description} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dueDate">Due Date</label>
                                        <input type="date" id="dueDate" name="dueDate" value={newAssignment.dueDate} onChange={handleInputChange} required />
                                    </div>
                                    <button onClick={handleCreateAssignment} className="add-button">Create Assignment</button>
                                    <button onClick={() => setIsAddingAssignment(false)}>Cancel</button>
                                </div>
                            )}
                        </div>

                        {/* Section for Submissions and Grading will go here */}
                    </>
                )}

                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
    );
}

export default TeacherDashboard;