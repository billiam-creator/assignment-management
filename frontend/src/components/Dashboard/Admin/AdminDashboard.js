import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import UserManagement from './UserManagement';
import EnrollmentRequests from './EnrollmentRequests';
import CourseManagement from './CourseManagement';

function AdminDashboard() {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [activeSection, setActiveSection] = useState('dashboard');

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalTeachersOverview, setTotalTeachersOverview] = useState(0);
    const [totalStudentsOverview, setTotalStudentsOverview] = useState(0);
    const [totalCoursesOverview, setTotalCoursesOverview] = useState(0);

    const [newCourseName, setNewCourseName] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [teachersListForCourseDropdown, setTeachersListForCourseDropdown] = useState([]);
    const [addCourseLoading, setAddCourseLoading] = useState(false);

    const API_BASE_URL = 'http://localhost:5000/api/admin'; 

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/'); 
    }, [navigate]);

   
    const fetchDashboardData = useCallback(async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard-data`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setTotalUsers(data.totalUsers || 0);
                setTotalTeachersOverview(data.totalTeachers || 0);
                setTotalStudentsOverview(data.totalStudents || 0);
                setTotalCoursesOverview(data.totalCourses || 0);
            } else {
                console.error('Failed to fetch dashboard data:', response.status);
                toast.error('Failed to fetch dashboard data.');
                if (response.status === 401 || response.status === 403) { 
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Network error fetching dashboard data.');
        }
    }, [API_BASE_URL, handleLogout, setTotalCoursesOverview, setTotalStudentsOverview, setTotalTeachersOverview, setTotalUsers]);

   
    const fetchTeachersForCourseDropdown = useCallback(async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/teachers`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setTeachersListForCourseDropdown(data);
            } else {
                console.error('Failed to fetch teachers for dropdown:', response.status);
                toast.error('Failed to fetch teachers for course assignment.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error fetching teachers for dropdown:', error);
            toast.error('Network error fetching teachers for course assignment.');
        }
    }, [API_BASE_URL, handleLogout, setTeachersListForCourseDropdown]);

    const handleAddCourse = async () => {
        if (!newCourseName || !selectedInstructor) {
            toast.warn('Please enter course name and select an instructor.');
            return;
        }
        if (!authToken) { // Ensure token exists before attempting to add course
            handleLogout();
            return;
        }

        setAddCourseLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name: newCourseName, instructorId: selectedInstructor }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || 'Course added successfully!');
                setNewCourseName('');
                setSelectedInstructor('');
                fetchDashboardData(authToken); 
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to add course.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error('Network error adding course.');
        } finally {
            setAddCourseLoading(false);
        }
    };

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        if (!tokenFromStorage || userRole !== 'admin') {
            navigate('/'); 
            return;
        }
        setAuthToken(tokenFromStorage);
        fetchDashboardData(tokenFromStorage);
        fetchTeachersForCourseDropdown(tokenFromStorage);
    }, [navigate, fetchDashboardData, fetchTeachersForCourseDropdown]);


    const renderDashboardContent = () => {
        const adminLoggedInName = localStorage.getItem('name') || 'Admin';
        return (
            <>
                <div className="header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {adminLoggedInName}!</p>
                </div>

                <div className="overview-cards">
                    <div className="card">
                        <h3>Total Users</h3>
                        <div className="number">{totalUsers}</div>
                    </div>
                    <div className="card">
                        <h3>Total Courses</h3>
                        <div className="number">{totalCoursesOverview}</div>
                    </div>
                    <div className="card">
                        <h3>Total Teachers</h3>
                        <div className="number">{totalTeachersOverview}</div>
                    </div>
                    <div className="card">
                        <h3>Total Students</h3>
                        <div className="number">{totalStudentsOverview}</div>
                    </div>
                </div>

                <div className="add-course-section">
                    <h2>Add New Course</h2>
                    <div className="form-group">
                        <label htmlFor="courseName">Course Name</label>
                        <input
                            type="text"
                            id="courseName"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            placeholder="e.g., Introduction to Programming"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="instructor">Instructor</label>
                        <select
                            id="instructor"
                            value={selectedInstructor}
                            onChange={(e) => setSelectedInstructor(e.target.value)}
                            required
                        >
                            <option value="">Select Instructor</option>
                            {teachersListForCourseDropdown.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleAddCourse} className="add-button" disabled={addCourseLoading}>
                        {addCourseLoading ? 'Adding...' : 'Add Course'}
                    </button>
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return renderDashboardContent();
            case 'user-management':
                return <UserManagement />;
            case 'enrollment-requests':
                return <EnrollmentRequests />;
            case 'course-management':
                return <CourseManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <h2>Admin Portal</h2>
                <ul>
                    <li
                        className={activeSection === 'dashboard' ? 'active' : ''}
                        onClick={() => setActiveSection('dashboard')}
                        style={{ cursor: 'pointer' }}
                    >
                        Dashboard
                    </li>
                    <li
                        className={activeSection === 'user-management' ? 'active' : ''}
                        onClick={() => setActiveSection('user-management')}
                        style={{ cursor: 'pointer' }}
                    >
                        User Management
                    </li>
                    <li
                        className={activeSection === 'enrollment-requests' ? 'active' : ''}
                        onClick={() => setActiveSection('enrollment-requests')}
                        style={{ cursor: 'pointer' }}
                    >
                        Enrollment Requests
                    </li>
                    <li
                        className={activeSection === 'course-management' ? 'active' : ''}
                        onClick={() => setActiveSection('course-management')}
                        style={{ cursor: 'pointer' }}
                    >
                        Course Management
                    </li>
                    <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        Logout
                    </li>
                </ul>
            </div>
            <div className="content">
                {renderContent()}
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
    );
}

export default AdminDashboard;
