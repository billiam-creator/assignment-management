// frontend/src/components/Auth/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthPages.css'; // Consistent CSS

const ResetPasswordPage = () => {
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(true); // State to check token validity

    const API_BASE_URL = 'http://localhost:5000/api/auth';

    // Optional: Verify token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/verify-reset-token/${token}`);
                if (!response.ok) {
                    setIsValidToken(false);
                    toast.error('Invalid or expired password reset link.');
                    setMessage('Invalid or expired password reset link. Please request a new one.');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                setIsValidToken(false);
                toast.error('Network error during token verification.');
                setMessage('Error verifying reset link. Please try again.');
            }
        };
        if (token) {
            verifyToken();
        } else {
            setIsValidToken(false);
            setMessage('No reset token provided.');
            toast.error('No reset token provided.');
        }
    }, [token, API_BASE_URL]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            toast.error('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Password has been reset successfully!');
                setMessage(data.message || 'Password has been reset successfully!');
                setTimeout(() => navigate('/'), 3000); // Redirect to login after 3 seconds
            } else {
                setMessage(data.message || 'Failed to reset password.');
                toast.error(data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Network error. Please try again.');
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isValidToken) {
        return (
            <div className="auth-container">
                 <div className="auth-form-card">
                    <h2>Invalid Link</h2>
                    <p className="error-message">{message}</p>
                    <p className="auth-link-text">
                        Please request a new password reset link from the <Link to="/forgot-password">Forgot Password page</Link>.
                    </p>
                 </div>
                 <ToastContainer />
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-form-card">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                {message && <p className="form-message">{message}</p>}
                <p className="auth-link-text">
                    <Link to="/">Back to Login</Link>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ResetPasswordPage;