import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function CreateAssignment() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:5000/api/assignments'; 
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        backendUrl,
        { title, description, dueDate },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error creating assignment:', error);
      
    }
  };

  return (
    <div>
      <h2>Create New Assignment</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter assignment description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDueDate">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Assignment
        </Button>
      </Form>
    </div>
  );
}

export default CreateAssignment;