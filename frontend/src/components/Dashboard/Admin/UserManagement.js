import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_BASE_URL = 'http://localhost:5000/api/admin';
    const getAuthToken = useCallback(() => localStorage.getItem('token'), []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                // Handle logout or redirect if token is missing
                toast.error('Authentication token missing. Please log in again.');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch users: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message);
            toast.error('Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, getAuthToken, toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="user-management">
            <h2>User Management</h2>
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {/* Add buttons for Edit/Delete User */}
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
}

export default UserManagement;