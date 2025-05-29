import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegistrationPage() {
    const navigate = useNavigate();
    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]); 
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

        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const registerAs = e.target.registerAs.value;

        const registrationData = {
            username: username,
            email: email,
            password: password,
            role: registerAs,
            // Only include courses if the role is student
            ...(registerAs === 'student' && { courses: selectedCourses })
        };

        console.log('Registration Data:', registrationData);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();

            if (response.ok && data.message === 'User registered successfully!') {
                toast.success('Registration successful!');
                setTimeout(() => {
                    navigate('/'); 
                }, 1500);
            } else {
                toast.error(data.message || 'Registration failed');
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
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="registerAs">Register as</label>
                        <select id="registerAs" name="registerAs">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {/* Course Selection for Students */}
                    <div className="form-group">
                        <label htmlFor="courses">Select Courses (for Students)</label>
                        <select
                            id="courses"
                            name="courses"
                            multiple
                            value={selectedCourses}
                            onChange={handleCourseSelection}
                            
                            disabled={document.getElementById('registerAs')?.value !== 'student'}
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
                    <button type="submit" className="submit-button">Submit</button>
                </form>
                <div className="login-link">
                    Already have an account? <a href="/">Login</a>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
    );
}

export default RegistrationPage;

