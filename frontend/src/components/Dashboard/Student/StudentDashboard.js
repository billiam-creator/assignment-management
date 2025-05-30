import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StudentDashboard.css'; // Ensure this CSS file is linked

function StudentDashboard() {
    const navigate = useNavigate();
    const [studentInfo, setStudentInfo] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [courseRequests, setCourseRequests] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const [loadingInfo, setLoadingInfo] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(true);

    const API_BASE_URL = 'http://localhost:5000/api/students';
    const getAuthToken = useCallback(() => localStorage.getItem('token'), []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/');
    }, [navigate]);

    // Removed 'toast' from dependencies
    const fetchStudentData = useCallback(async () => {
        setLoadingInfo(true);
        try {
            const token = getAuthToken();
            if (!token) {
                handleLogout();
                return;
            }
            const response = await fetch(`${API_BASE_URL}/info`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setStudentInfo(data);
                setEnrolledCourses(data.enrolledCourses || []);
            } else {
                console.error('Failed to fetch student info:', response.status);
                toast.error('Failed to fetch student info.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error fetching student info:', error);
            toast.error('Network error fetching student info.');
        } finally {
            setLoadingInfo(false);
        }
    }, [API_BASE_URL, getAuthToken, handleLogout, setStudentInfo, setEnrolledCourses]);

    // Removed 'toast' from dependencies
    const fetchCourseRequests = useCallback(async () => {
        setLoadingRequests(true);
        try {
            const token = getAuthToken();
            if (!token) {
                handleLogout();
                return;
            }
            const response = await fetch(`${API_BASE_URL}/course-requests`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCourseRequests(data);
            } else {
                console.error('Failed to fetch course requests:', response.status);
                toast.error('Failed to fetch course requests.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error fetching course requests:', error);
            toast.error('Network error fetching course requests.');
        } finally {
            setLoadingRequests(false);
        }
    }, [API_BASE_URL, getAuthToken, handleLogout, setCourseRequests]);

    // Removed 'toast' from dependencies
    const fetchAssignments = useCallback(async () => {
        setLoadingAssignments(true);
        try {
            const token = getAuthToken();
            if (!token) {
                handleLogout();
                return;
            }
            const response = await fetch(`${API_BASE_URL}/assignments`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                console.error('Failed to fetch assignments:', response.status);
                toast.error('Failed to fetch assignments.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
            toast.error('Network error fetching assignments.');
        } finally {
            setLoadingAssignments(false);
        }
    }, [API_BASE_URL, getAuthToken, handleLogout, setAssignments]);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'student') {
            navigate('/');
            return;
        }
        fetchStudentData();
        fetchCourseRequests();
        fetchAssignments();
    }, [navigate, fetchStudentData, fetchCourseRequests, fetchAssignments]);

    if (loadingInfo || loadingRequests || loadingAssignments) {
        return <div className="dashboard-loading">Loading student dashboard...</div>;
    }

    return (
        <div className="student-dashboard-container">
            <div className="sidebar">
                <h2>Student Portal</h2>
                <nav>
                    <ul>
                        <li><Link to="/student/dashboard" className="active">Dashboard</Link></li>
                        <li><Link to="/student/my-info">My Information</Link></li>
                        <li><Link to="/student/enrolled-courses">Enrolled Courses</Link></li>
                        <li><Link to="/student/my-requests">My Course Requests</Link></li>
                        <li><Link to="/student/my-assignments">Assignments</Link></li>
                        <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
                    </ul>
                </nav>
            </div>
            <div className="content">
                <div className="header">
                    <h1>Student Dashboard</h1>
                    <p>Welcome, {studentInfo?.name || studentInfo?.username || 'Student'}!</p>
                </div>

                <div className="dashboard-grid">
                    <div className="info-card card">
                        <h3>My Information</h3>
                        <p>Name: {studentInfo?.name || studentInfo?.username || 'N/A'}</p>
                        <p>Major: {studentInfo?.major || 'N/A'}</p>
                        <p>Email: {studentInfo?.email || 'N/A'}</p>
                    </div>

                    <div className="courses-card card">
                        <h3>Enrolled Courses</h3>
                        {enrolledCourses.length > 0 ? (
                            <div className="course-list">
                                {enrolledCourses.map((course) => (
                                    <div key={course.id} className="course-item">
                                        <Link to={`/student/course/${course.id}`}>
                                            <h4>{course.name}</h4>
                                            <p>Instructor: {course.instructor ? course.instructor.username : 'N/A'}</p>
                                            {/* Add more course details if available, e.g., <p>{course.description}</p> */}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>You are not enrolled in any approved courses yet.</p>
                        )}
                    </div>

                    <div className="requests-card card">
                        <h3>My Course Requests</h3>
                        {courseRequests.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseRequests.map((request) => (
                                        <tr key={request._id}>
                                            <td>{request.course ? request.course.name : 'N/A'}</td>
                                            <td><span className={`status-${request.status.toLowerCase()}`}>{request.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>You have no pending or processed course requests.</p>
                        )}
                    </div>

                    <div className="assignments-card card">
                        <h3>Assignments</h3>
                        {assignments.length > 0 ? (
                            <div className="assignment-list">
                                <ul>
                                    {assignments.map((assignment) => (
                                        <li key={assignment._id}>
                                            <Link to={`/student/assignment/${assignment._id}`}>
                                                {assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                {assignment.course && ` (Course: ${assignment.course.name})`}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No assignments available.</p>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
    );
}

export default StudentDashboard;
