import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function EnrollmentRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const authToken = localStorage.getItem('token');
    const API_BASE_URL = 'http://localhost:5000/api/admin';

    const fetchEnrollmentRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/enrollment-requests`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            } else {
                console.error('Failed to fetch enrollment requests:', response.status);
                setError('Failed to fetch enrollment requests.');
                toast.error('Failed to fetch enrollment requests.');
            }
        } catch (err) {
            console.error('Error fetching enrollment requests:', err);
            setError('Network error fetching enrollment requests.');
            toast.error('Network error fetching enrollment requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchEnrollmentRequests();
        }
    }, [authToken]);

    const handleApprove = async (requestId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/enrollment-requests/${requestId}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || `Enrollment request ${requestId} approved!`);
                fetchEnrollmentRequests();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || `Failed to approve enrollment request ${requestId}.`);
            }
        } catch (err) {
            console.error('Error approving request:', err);
            toast.error('Network error approving enrollment.');
        }
    };

    if (loading) {
        return <p>Loading enrollment requests...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Enrollment Requests</h1>
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
                                        <button className="action-button" onClick={() => handleApprove(request._id)}>Approve</button>
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