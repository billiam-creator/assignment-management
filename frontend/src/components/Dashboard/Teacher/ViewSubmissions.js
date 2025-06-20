import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ViewSubmissions() {
    const { assignmentId, courseId } = useParams(); // Get both assignmentId and courseId from URL
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]); // eslint-disable-line
    const [loading, setLoading] = useState(true);
    const [grading, setGrading] = useState(false);
    const [gradingData, setGradingData] = useState({}); // State to manage grading inputs
    
    const API_BASE_URL = 'http://localhost:5000/api/assignments';
    const getAuthToken = useCallback(() => localStorage.getItem('token'), []);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) { 
                toast.error('Authentication required');
                navigate('/login'); 
                return; 
            }

            // Try to fetch assignment details - try multiple common endpoint patterns
            let assignResponse;
            let assignmentData = null;
            
            // Method 1: Try /api/assignments/{id}
            try {
                assignResponse = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (assignResponse.ok) {
                    assignmentData = await assignResponse.json();
                }
            } catch (err) {
                console.log('Method 1 failed:', err);
            }

            // Method 2: Try /api/teachers/assignments/{id}
            if (!assignmentData) {
                try {
                    assignResponse = await fetch(`${API_BASE_URL}/teachers/assignments/${assignmentId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (assignResponse.ok) {
                        assignmentData = await assignResponse.json();
                    }
                } catch (err) {
                    console.log('Method 2 failed:', err);
                }
            }

            // Method 3: Try /api/teacher/assignments/{id} (singular)
            if (!assignmentData) {
                try {
                    assignResponse = await fetch(`${API_BASE_URL}/teacher/assignments/${assignmentId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (assignResponse.ok) {
                        assignmentData = await assignResponse.json();
                    }
                } catch (err) {
                    console.log('Method 3 failed:', err);
                }
            }

            // If courseId is available, try with course context
            if (!assignmentData && courseId) {
                try {
                    assignResponse = await fetch(`${API_BASE_URL}/courses/${courseId}/assignments/${assignmentId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (assignResponse.ok) {
                        assignmentData = await assignResponse.json();
                    }
                } catch (err) {
                    console.log('Course-based assignment fetch failed:', err);
                }
            }

            // If we still don't have assignment data, create a placeholder
            if (!assignmentData) {
                console.log('Could not fetch assignment details, proceeding with submissions only');
                assignmentData = {
                    title: 'Assignment',
                    _id: assignmentId,
                    dueDate: null
                };
            }
            
            setAssignment(assignmentData);

            // Fetch submissions - try multiple endpoint patterns
            let submissionsData = [];
            
            // Method 1: Try /api/assignments/{id}/submissions
            try {
                const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submissions`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.ok) {
                    submissionsData = await response.json();
                } else {
                    console.log('Method 1 submissions fetch failed, status:', response.status);
                }
            } catch (err) {
                console.log('Method 1 submissions error:', err);
            }

            // Method 2: Try /api/teachers/assignments/{id}/submissions
            if (submissionsData.length === 0) {
                try {
                    const response = await fetch(`${API_BASE_URL}/teachers/assignments/${assignmentId}/submissions`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (response.ok) {
                        submissionsData = await response.json();
                    } else {
                        console.log('Method 2 submissions fetch failed, status:', response.status);
                    }
                } catch (err) {
                    console.log('Method 2 submissions error:', err);
                }
            }

            // Method 3: Try /api/teacher/assignments/{id}/submissions (singular)
            if (submissionsData.length === 0) {
                try {
                    const response = await fetch(`${API_BASE_URL}/teacher/assignments/${assignmentId}/submissions`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (response.ok) {
                        submissionsData = await response.json();
                    } else {
                        console.log('Method 3 submissions fetch failed, status:', response.status);
                    }
                } catch (err) {
                    console.log('Method 3 submissions error:', err);
                }
            }

            // Method 4: Try /api/submissions?assignmentId={id}
            if (submissionsData.length === 0) {
                try {
                    const response = await fetch(`${API_BASE_URL}/submissions?assignmentId=${assignmentId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (response.ok) {
                        submissionsData = await response.json();
                    } else {
                        console.log('Method 4 submissions fetch failed, status:', response.status);
                    }
                } catch (err) {
                    console.log('Method 4 submissions error:', err);
                }
            }

            // Initialize grading data for ungraded submissions
            const initialGradingData = {};
            submissionsData.forEach(submission => {
                if (submission.grade === undefined) {
                    initialGradingData[submission._id] = {
                        grade: '',
                        feedback: ''
                    };
                }
            });
            setGradingData(initialGradingData);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            toast.error(err.message || 'Failed to load submissions.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, assignmentId, courseId, getAuthToken, navigate]);

    const handleGradeInputChange = (submissionId, field, value) => {
        setGradingData(prev => ({
            ...prev,
            [submissionId]: {
                ...prev[submissionId],
                [field]: value
            }
        }));
    };

    const handleGradeSubmission = async (submissionId) => {
        const gradeData = gradingData[submissionId];
        if (!gradeData || gradeData.grade === '') {
            toast.error('Please enter a grade');
            return;
        }

        const grade = parseFloat(gradeData.grade);
        if (isNaN(grade) || grade < 0 || grade > 100) {
            toast.error('Please enter a valid grade between 0 and 100');
            return;
        }

        setGrading(true);
        try {
            const token = getAuthToken();
            if (!token) { 
                toast.error('Authentication required');
                navigate('/login'); 
                return; 
            }

            const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}/grade`, {
                method: 'POST', // Your backend uses POST, not PUT
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    grade: grade, 
                    feedback: gradeData.feedback || '' 
                }),
            });

            if (response.ok) {
                toast.success('Submission graded successfully!');
                // Remove from grading data since it's now graded
                setGradingData(prev => {
                    const newData = { ...prev };
                    delete newData[submissionId];
                    return newData;
                });
                fetchSubmissions(); // Refresh submissions list
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to grade submission.');
            }
        } catch (err) {
            console.error('Error grading submission:', err);
            toast.error('Network error grading submission.');
        } finally {
            setGrading(false);
        }
    };

    useEffect(() => {
        if (assignmentId) {
            fetchSubmissions();
        }
    }, [fetchSubmissions, assignmentId]);

    if (loading) {
        return (
            <div className="view-submissions-page" style={{ padding: '20px' }}>
                <div>Loading submissions...</div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="view-submissions-page" style={{ padding: '20px' }}>
                <div>Assignment not found or unauthorized.</div>
                <button onClick={() => navigate(-1)} style={{ marginTop: '10px' }}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="view-submissions-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>
                    ← Back to Dashboard
                </button>
                <h2>Submissions for "{assignment.title}"</h2>
                <p><strong>Due Date:</strong> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'Not set'}</p>
                <p><strong>Total Submissions:</strong> {submissions.length}</p>
            </div>

            {submissions.length > 0 ? (
                <div>
                    {submissions.map(submission => (
                        <div 
                            key={submission._id} 
                            style={{ 
                                border: '1px solid #ddd', 
                                borderRadius: '8px',
                                padding: '20px', 
                                marginBottom: '20px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <div style={{ marginBottom: '15px' }}>
                                <h4>Student Information</h4>
                                <p><strong>Student:</strong> {submission.student?.name || 'Unknown Student'}</p>
                                <p><strong>Email:</strong> {submission.student?.email || 'N/A'}</p>
                                <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <h4>Submission Content</h4>
                                <div style={{ 
                                    backgroundColor: 'white', 
                                    padding: '10px', 
                                    borderRadius: '4px',
                                    border: '1px solid #eee'
                                }}>
                                    <p><strong>Text Submission:</strong></p>
                                    <p>{submission.submissionText || 'No text submission provided'}</p>
                                </div>
                                
                                {submission.submissionFileUrl && (
                                    <div style={{ marginTop: '10px' }}>
                                        <p><strong>Attached File:</strong></p>
                                        <a 
                                            href={submission.submissionFileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ color: '#007bff', textDecoration: 'none' }}
                                        >
                                            📎 View Submitted File
                                        </a>
                                    </div>
                                )}
                            </div>

                            {submission.grade !== undefined ? (
                                <div style={{ 
                                    backgroundColor: '#e8f5e8', 
                                    padding: '15px', 
                                    borderRadius: '4px',
                                    border: '1px solid #c3e6c3'
                                }}>
                                    <h4>Graded ✓</h4>
                                    <p><strong>Grade:</strong> {submission.grade}/100</p>
                                    <p><strong>Feedback:</strong> {submission.feedback || 'No feedback provided'}</p>
                                    <p><strong>Graded on:</strong> {submission.gradedAt ? new Date(submission.gradedAt).toLocaleString() : 'Unknown'}</p>
                                </div>
                            ) : (
                                <div style={{ 
                                    backgroundColor: '#fff3cd', 
                                    padding: '15px', 
                                    borderRadius: '4px',
                                    border: '1px solid #ffeaa7'
                                }}>
                                    <h4>Grade This Submission</h4>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>
                                            <strong>Grade (0-100):</strong>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter grade"
                                            min="0"
                                            max="100"
                                            value={gradingData[submission._id]?.grade || ''}
                                            onChange={(e) => handleGradeInputChange(submission._id, 'grade', e.target.value)}
                                            style={{ 
                                                padding: '8px', 
                                                border: '1px solid #ddd', 
                                                borderRadius: '4px',
                                                width: '100px'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>
                                            <strong>Feedback:</strong>
                                        </label>
                                        <textarea
                                            placeholder="Enter feedback for the student"
                                            value={gradingData[submission._id]?.feedback || ''}
                                            onChange={(e) => handleGradeInputChange(submission._id, 'feedback', e.target.value)}
                                            rows="4"
                                            style={{ 
                                                width: '100%', 
                                                padding: '8px', 
                                                border: '1px solid #ddd', 
                                                borderRadius: '4px',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={() => handleGradeSubmission(submission._id)}
                                        disabled={grading}
                                        style={{
                                            backgroundColor: grading ? '#ccc' : '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            cursor: grading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {grading ? 'Submitting Grade...' : 'Submit Grade'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '18px', color: '#666' }}>No submissions for this assignment yet.</p>
                    <p>Students haven't submitted their work for this assignment.</p>
                </div>
            )}
            
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default ViewSubmissions;