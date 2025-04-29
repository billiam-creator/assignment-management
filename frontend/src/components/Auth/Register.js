import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

function Register({ showNotification }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:5000/api/auth/register';

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(backendUrl, { username, email, password, role }); 
      showNotification(response.data.message, 'success');
      navigate('/login');
    } catch (error) {
      showNotification(error.response?.data?.msg || 'Registration failed', 'danger');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Register as:</Form.Label>
          <Form.Check
            type="radio"
            label="Student"
            name="role"
            value="student"
            checked={role === 'student'}
            onChange={(e) => setRole(e.target.value)}
          />
          <Form.Check
            type="radio"
            label="Teacher"
            name="role"
            value="teacher"
            checked={role === 'teacher'}
            onChange={(e) => setRole(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      <p className="mt-2">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Register;