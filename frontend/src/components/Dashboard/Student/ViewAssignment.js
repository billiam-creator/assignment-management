import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function ViewAssignment() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const API_BASE_URL = 'http://localhost:5000/api/students';
    const getAuthToken = useCallback(() => localStorage.getItem('token'), []);

    const fetchAssignmentDetails = useCallback(async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) { navigate('/'); return; }

            const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setAssignment(data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch assignment: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching assignment:', err);
            toast.error('Failed to load assignment details.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, assignmentId, getAuthToken, navigate, toast]);

    const fetchSubmission = useCallback(async () => {
        try {
            const token = getAuthToken();
            if (!token) { navigate('/'); return; }

            const response = await fetch(`${API_BASE_URL}/submissions/${assignmentId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setSubmission(data);
                if (data && data.submissionText) {
                    setSubmissionText(data.submissionText);
                }
            } else if (response.status === 404) {
                setSubmission(null); // No submission yet
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch submission: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching submission:', err);
            toast.error('Failed to load submission status.');
        }
    }, [API_BASE_URL, assignmentId, getAuthToken, navigate, toast]);

    const handleSubmit = async () => {
        if (!submissionText.trim()) {
            toast.warn('Submission text cannot be empty.');
            return;
        }
        setSubmitting(true);
        try {
            const token = getAuthToken();
            if (!token) { navigate('/'); return; }

            const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ submissionText }),
            });
            if (response.ok) {
                toast.success('Assignment submitted successfully!');
                fetchSubmission(); // Refresh submission status
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to submit assignment.');
            }
        } catch (err) {
            console.error('Error submitting assignment:', err);
            toast.error('Network error submitting assignment.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchAssignmentDetails();
        fetchSubmission();
    }, [fetchAssignmentDetails, fetchSubmission]);

    if (loading) return <div>Loading assignment...</div>;
    if (!assignment) return <div>Assignment not found.</div>;

    return (
        <div className="view-assignment-page">
            <h2>{assignment.title}</h2>
            <p><strong>Course:</strong> {assignment.course ? assignment.course.name : 'N/A'}</p>
            <p><strong>Description:</strong> {assignment.description}</p>
            <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>

            <h3>Your Submission</h3>
            {submission ? (
                <div>
                    <p><strong>Status:</strong> Submitted</p>
                    <p><strong>Submitted On:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                    <p><strong>Your Text:</strong> {submission.submissionText}</p>
                    {submission.grade !== undefined && <p><strong>Grade:</strong> {submission.grade}</p>}
                    {submission.feedback && <p><strong>Feedback:</strong> {submission.feedback}</p>}
                </div>
            ) : (
                <div>
                    <p>No submission yet.</p>
                    <h4>Submit Assignment</h4>
                    <textarea
                        placeholder="Type your submission here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        rows="10"
                        cols="50"
                    ></textarea>
                    <br />
                    <button onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default ViewAssignment;