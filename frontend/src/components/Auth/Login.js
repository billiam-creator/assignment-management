import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

function Login({ showNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:5000/api/auth/login';
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(backendUrl, { email, password });
      const { token, user, message } = response.data;
      login(token, user);
      showNotification(message, 'success');
      console.log('Login successful in Login component, navigating...'); 
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error); 
      showNotification(error.response?.data?.msg || 'Login failed', 'danger');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
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

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <p className="mt-2">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;