import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TeacherDashboard.css'; // Ensure this CSS file is linked

function TeacherDashboard() {
    const navigate = useNavigate();
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [myCourses, setMyCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [studentsInSelectedCourse, setStudentsInSelectedCourse] = useState([]);
    const [assignmentsInSelectedCourse, setAssignmentsInSelectedCourse] = useState([]);

    const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
    const [newAssignmentDescription, setNewAssignmentDescription] = useState('');
    const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');
    const [isAddingAssignment, setIsAddingAssignment] = useState(false);

    const [loadingInfo, setLoadingInfo] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [creatingAssignment, setCreatingAssignment] = useState(false);

    const API_BASE_URL = 'http://localhost:5000/api/teachers';
    const getAuthToken = useCallback(() => localStorage.getItem('token'), []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/');
    }, [navigate]);

    // Define fetchAssignmentsForCourse BEFORE fetchMyCourses to avoid initialization error
    // Removed 'toast' from dependencies
    const fetchAssignmentsForCourse = useCallback(async (courseId) => {
        if (!courseId) {
            setAssignmentsInSelectedCourse([]);
            return;
        }
        setLoadingAssignments(true);
        try {
            const token = getAuthToken();
            if (!token) {
                handleLogout();
                return;
            }
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/assignments`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setAssignmentsInSelectedCourse(data);
            } else {
                console.error(`Failed to fetch assignments for course ${courseId}:`, response.status);
                toast.error('Failed to fetch assignments for this course.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error(`Error fetching assignments for course ${courseId}:`, error);
            toast.error('Network error fetching assignments for this course.');
        } finally {
            setLoadingAssignments(false);
        }
    }, [API_BASE_URL, getAuthToken, handleLogout, setAssignmentsInSelectedCourse]);

    // Removed 'toast' from dependencies
    const fetchTeacherInfo = useCallback(async () => {
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
                setTeacherInfo(data);
            } else {
                console.error('Failed to fetch teacher info:', response.status);
                toast.error('Failed to fetch teacher info.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error fetching teacher info:', error);
            toast.error('Network error fetching teacher info.');
        } finally {
            setLoadingInfo(false);
        }
    }, [API_BASE_URL, getAuthToken, handleLogout, setTeacherInfo]);

    // Removed 'toast' from dependencies
    const fetchMyCourses = useCallback(async () => {
        setLoadingCourses(true);
        try {
            const token = getAuthToken();
            if (!token) {
                handleLogout();
                return;
            }
            const response = await fetch(`${API_BASE_URL}/courses`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setMyCourses(data);
                // If there's only one course, select it by default and load its students/assignments
                if (data.length > 0) { // Changed from === 1 to > 0 to handle cases with multiple courses
                    const firstCourseId = data[0]._id;
                    setSelectedCourseId(firstCourseId);
                    setStudentsInSelectedCourse(data[0].enrolledStudents || []);
                    // Automatically fetch assignments for the first course
                    fetchAssignmentsForCourse(firstCourseId); // This call is now safe due to reordering
                }
            } else {
                console.error('Failed to fetch teacher\'s courses:', response.status);
                toast.error('Failed to fetch your courses.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error fetching teacher\'s courses:', error);
            toast.error('Error fetching your courses.');
        } finally {
            setLoadingCourses(false);
        }
    }, [API_BASE_URL, getAuthToken, handleLogout, setMyCourses, setSelectedCourseId, setStudentsInSelectedCourse, fetchAssignmentsForCourse]);

    const handleCourseSelect = useCallback((event) => {
        const courseId = event.target.value;
        setSelectedCourseId(courseId);
        const selectedCourse = myCourses.find(course => course._id === courseId);
        setStudentsInSelectedCourse(selectedCourse?.enrolledStudents || []);
        fetchAssignmentsForCourse(courseId);
        setIsAddingAssignment(false); // Hide assignment form when course changes
    }, [myCourses, fetchAssignmentsForCourse]);

    const handleCreateAssignment = async () => {
        if (!selectedCourseId || !newAssignmentTitle || !newAssignmentDescription || !newAssignmentDueDate) {
            toast.warn('Please fill in all assignment details and select a course.');
            return;
        }
        const token = getAuthToken();
        if (!token) {
            handleLogout();
            return;
        }

        setCreatingAssignment(true);
        try {
            const response = await fetch(`${API_BASE_URL}/courses/${selectedCourseId}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newAssignmentTitle,
                    description: newAssignmentDescription,
                    dueDate: newAssignmentDueDate,
                }),
            });

            if (response.ok) {
                toast.success('Assignment created successfully!');
                setNewAssignmentTitle('');
                setNewAssignmentDescription('');
                setNewAssignmentDueDate('');
                setIsAddingAssignment(false);
                fetchAssignmentsForCourse(selectedCourseId);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to create assignment.');
                if (response.status === 401 || response.status === 403) {
                    handleLogout();
                }
            }
        } catch (error) {
            console.error('Error creating assignment:', error);
            toast.error('Network error creating assignment.');
        } finally {
            setCreatingAssignment(false);
        }
    };

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'teacher') {
            navigate('/');
            return;
        }
        fetchTeacherInfo();
        fetchMyCourses();
    }, [navigate, fetchTeacherInfo, fetchMyCourses]);

    // This effect runs when selectedCourseId changes to fetch assignments for it
    useEffect(() => {
        if (selectedCourseId) {
            fetchAssignmentsForCourse(selectedCourseId);
        } else {
            setAssignmentsInSelectedCourse([]);
        }
    }, [selectedCourseId, fetchAssignmentsForCourse]);


    if (loadingInfo || loadingCourses) {
        return <div className="dashboard-loading">Loading teacher dashboard...</div>;
    }

    return (
        <div className="teacher-dashboard-container">
            <div className="sidebar">
                <h2>Teacher Portal</h2>
                <nav>
                    <ul>
                        <li><Link to="/teacher/dashboard" className="active">Dashboard</Link></li>
                        <li><Link to="/teacher/my-courses">My Courses</Link></li>
                        <li><Link to="/teacher/assignments">Assignments</Link></li>
                        <li><Link to="/teacher/submissions">Submissions</Link></li>
                        <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
                    </ul>
                </nav>
            </div>
            <div className="content">
                <div className="header">
                    <h1>Teacher Dashboard</h1>
                    <p>Welcome, {teacherInfo?.name || teacherInfo?.username || 'Teacher'}!</p>
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
                    <div className="dashboard-grid">
                        <div className="card enrolled-students-card">
                            <h3>Students in {myCourses.find(c => c._id === selectedCourseId)?.name || 'Selected Course'}</h3>
                            {studentsInSelectedCourse.length > 0 ? (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentsInSelectedCourse.map((student) => (
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

                        <div className="card assignments-card">
                            <h3>Assignments for {myCourses.find(c => c._id === selectedCourseId)?.name || 'Selected Course'}</h3>
                            {loadingAssignments ? (
                                <p>Loading assignments...</p>
                            ) : assignmentsInSelectedCourse.length > 0 ? (
                                <div className="assignment-list">
                                    <ul>
                                        {assignmentsInSelectedCourse.map((assignment) => (
                                            <li key={assignment._id}>
                                                {assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                <Link to={`/teacher/assignment/${assignment._id}/submissions`} className="view-submissions-link">View Submissions</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p>No assignments created for this course yet.</p>
                            )}

                            {!isAddingAssignment ? (
                                <button onClick={() => setIsAddingAssignment(true)} className="add-button">Add New Assignment</button>
                            ) : (
                                <div className="add-assignment-form">
                                    <h4>Create New Assignment</h4>
                                    <div className="form-group">
                                        <label htmlFor="newAssignmentTitle">Title</label>
                                        <input
                                            type="text"
                                            id="newAssignmentTitle"
                                            placeholder="Assignment Title"
                                            value={newAssignmentTitle}
                                            onChange={(e) => setNewAssignmentTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newAssignmentDescription">Description</label>
                                        <textarea
                                            id="newAssignmentDescription"
                                            placeholder="Assignment Description"
                                            value={newAssignmentDescription}
                                            onChange={(e) => setNewAssignmentDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newAssignmentDueDate">Due Date</label>
                                        <input
                                            type="date"
                                            id="newAssignmentDueDate"
                                            value={newAssignmentDueDate}
                                            onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button onClick={handleCreateAssignment} disabled={creatingAssignment}>
                                            {creatingAssignment ? 'Creating...' : 'Create Assignment'}
                                        </button>
                                        <button onClick={() => setIsAddingAssignment(false)} className="cancel-button">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
    );
}

export default TeacherDashboard;
