import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegistrationPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegistrationPage() {
    const navigate = useNavigate();
    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [registerAs, setRegisterAs] = useState('student');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(''); // New state for password error

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses');
                if (response.ok) {
                    const data = await response.json();
                    setAvailableCourses(data);
                } else {
                    toast.error('Failed to fetch available courses.');
                    console.error('Failed to fetch available courses:', response.status);
                }
            } catch (error) {
                toast.error('Error fetching available courses.');
                console.error('Network error fetching available courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseSelection = (e) => {
        const options = Array.from(e.target.selectedOptions);
        const values = options.map(option => option.value);
        setSelectedCourses(values);
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        setPasswordError(''); // Clear any previous password error

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }

        const registrationData = {
            username: username,
            email: email,
            password: password,
            role: registerAs,
            ...(registerAs === 'student' && { courses: selectedCourses })
        };

        console.log('Registration Data being sent:', registrationData);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();
            console.log('Registration Response:', data);

            if (response.ok && data.message === 'User registered successfully!' && data.role) {
                toast.success('Registration successful!');
                setTimeout(() => {
                    navigate('/'); // Redirect to login after registration
                }, 1500);
            } else {
                toast.error(data.message || 'Registration failed');
                if (data.errors) {
                    console.error('Registration Errors from Backend:', data.errors);
                }
            }
        } catch (error) {
            toast.error('Error during registration');
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-form">
                <h2>Register Form</h2>
                <form onSubmit={handleRegistration}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {passwordError && <p className="error-message">{passwordError}</p>} {/* Display password error */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="registerAs">Register as</label>
                        <select
                            id="registerAs"
                            name="registerAs"
                            value={registerAs}
                            onChange={(e) => setRegisterAs(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {registerAs === 'student' && (
                        <div className="form-group">
                            <label htmlFor="courses">Select Courses (for Students)</label>
                            <select
                                id="courses"
                                name="courses"
                                multiple
                                value={selectedCourses}
                                onChange={handleCourseSelection}
                            >
                                {availableCourses.length > 0 ? (
                                    availableCourses.map(course => (
                                        <option key={course._id} value={course._id}>{course.name}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>No courses available</option>
                                )}
                            </select>
                        </div>
                    )}
                    <button type="submit" className="submit-button">Submit</button>
                </form>
                <div className="login-link">
                    Already have an account? <Link to="/">Login</Link>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
    );
}

export default RegistrationPage;