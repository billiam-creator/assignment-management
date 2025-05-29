
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = { identifier, password };
        console.log('Login Data:', loginData);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok && data.token && data.role && data.message === 'Login successful!') {
                toast.success('Login successful!');
                localStorage.setItem('token', data.token); // Store the token
                const userRole = data.role;
                switch (userRole) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'teacher':
                        navigate('/teacher/dashboard');
                        break;
                    case 'student':
                        navigate('/student/dashboard');
                        break;
                    default:
                        console.error('Unknown user role:', userRole);
                        toast.error('Unknown user role');
                        
                }
                console.log('Login Token:', data.token);
            } else {
                toast.error(data.message || 'Login failed. Invalid credentials.');
            }
        } catch (error) {
            toast.error('Error during login');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text" 
                    placeholder="Username or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
    );
};

export default LoginPage;