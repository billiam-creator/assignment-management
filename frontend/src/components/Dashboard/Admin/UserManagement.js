import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const authToken = localStorage.getItem('token');
    const API_BASE_URL = 'http://localhost:5000/api/admin';

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/users`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users:', response.status);
                    setError('Failed to fetch users.');
                    toast.error('Failed to fetch users.');
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Network error fetching users.');
                toast.error('Network error fetching users.');
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchUsers();
        }
    }, [authToken]);

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>User Management</h1>
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
                                    <button className="action-button edit-button">Edit</button>
                                    <button className="action-button delete-button">Delete</button>
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