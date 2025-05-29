import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

function EnrollmentRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_BASE_URL = 'http://localhost:5000/api/admin';
    const getAuthToken = useCallback(() => localStorage.getItem('token'), []);

    const fetchEnrollmentRequests = useCallback(async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                toast.error('Authentication token missing. Please log in again.');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/enrollment-requests`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch requests: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching enrollment requests:', err);
            setError(err.message);
            toast.error('Failed to load enrollment requests.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, getAuthToken, toast]);

    const handleApprove = async (requestId) => {
        try {
            const token = getAuthToken();
            if (!token) return;
            const response = await fetch(`${API_BASE_URL}/enrollment-requests/${requestId}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                toast.success('Request approved!');
                fetchEnrollmentRequests(); // Refresh list
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to approve request.');
            }
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Network error approving request.');
        }
    };

    const handleReject = async (requestId) => {
        try {
            const token = getAuthToken();
            if (!token) return;
            const response = await fetch(`${API_BASE_URL}/enrollment-requests/${requestId}/reject`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                toast.success('Request rejected!');
                fetchEnrollmentRequests(); // Refresh list
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to reject request.');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Network error rejecting request.');
        }
    };

    useEffect(() => {
        fetchEnrollmentRequests();
    }, [fetchEnrollmentRequests]);

    if (loading) return <div>Loading enrollment requests...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="enrollment-requests">
            <h2>Enrollment Requests</h2>
            {requests.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                            <tr key={request._id}>
                                <td>{request.student ? request.student.username : 'N/A'}</td>
                                <td>{request.course ? request.course.name : 'N/A'}</td>
                                <td>{request.status}</td>
                                <td>
                                    {request.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleApprove(request._id)}>Approve</button>
                                            <button onClick={() => handleReject(request._id)}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No pending enrollment requests.</p>
            )}
        </div>
    );
}

export default EnrollmentRequests;