import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function ViewSubmissions() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [grading, setGrading] = useState(false);
    const API_BASE_URL = 'http://localhost:5000/api/teachers';
    const getAuthToken = useCallback(() => localStorage.getItem('token'), []);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) { navigate('/'); return; }

            // First, fetch assignment details to confirm teacher's ownership
            const assignResponse = await fetch(`${API_BASE_URL}/courses/someCourseId/assignments/${assignmentId}`, { // This path is tricky, need courseId
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!assignResponse.ok) {
                const errorData = await assignResponse.json();
                throw new Error(errorData.message || `Failed to verify assignment: ${assignResponse.status}`);
            }
            const assignmentData = await assignResponse.json();
            setAssignment(assignmentData);


            const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submissions`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch submissions: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching submissions:', err);
            toast.error('Failed to load submissions.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, assignmentId, getAuthToken, navigate, toast]);

    const handleGradeSubmission = async (submissionId, grade, feedback) => {
        setGrading(true);
        try {
            const token = getAuthToken();
            if (!token) { navigate('/'); return; }

            const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}/grade`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ grade, feedback }),
            });
            if (response.ok) {
                toast.success('Submission graded successfully!');
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
        fetchSubmissions();
    }, [fetchSubmissions]);

    if (loading) return <div>Loading submissions...</div>;
    if (!assignment) return <div>Assignment not found or unauthorized.</div>;

    return (
        <div className="view-submissions-page">
            <h2>Submissions for "{assignment.title}"</h2>
            {submissions.length > 0 ? (
                <ul>
                    {submissions.map(submission => (
                        <li key={submission._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <p><strong>Student:</strong> {submission.student ? submission.student.username : 'N/A'} ({submission.student ? submission.student.email : 'N/A'})</p>
                            <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                            <p><strong>Submission Text:</strong> {submission.submissionText || 'No text submission'}</p>
                            {submission.submissionFileUrl && <p><strong>File:</strong> <a href={submission.submissionFileUrl} target="_blank" rel="noopener noreferrer">View File</a></p>}

                            {submission.grade !== undefined ? (
                                <p><strong>Grade:</strong> {submission.grade} - <strong>Feedback:</strong> {submission.feedback || 'N/A'}</p>
                            ) : (
                                <div>
                                    <h4>Grade Submission</h4>
                                    <input
                                        type="number"
                                        placeholder="Grade (0-100)"
                                        min="0"
                                        max="100"
                                        defaultValue={submission.grade}
                                        onChange={(e) => submission.tempGrade = e.target.value}
                                    />
                                    <textarea
                                        placeholder="Feedback"
                                        defaultValue={submission.feedback}
                                        onChange={(e) => submission.tempFeedback = e.target.value}
                                        rows="3"
                                    ></textarea>
                                    <button
                                        onClick={() => handleGradeSubmission(submission._id, submission.tempGrade, submission.tempFeedback)}
                                        disabled={grading}
                                    >
                                        {grading ? 'Grading...' : 'Submit Grade'}
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No submissions for this assignment yet.</p>
            )}
            <ToastContainer />
        </div>
    );
}

export default ViewSubmissions;