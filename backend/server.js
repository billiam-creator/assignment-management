require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); 
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const adminRoutes = require('./routes/admin');
const Course = require('./models/Course'); 

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find().select('_id name'); 
        res.json(courses);
    } catch (error) {
        console.error('Error fetching public courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
});


app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes); 
app.use('/api/teachers', teacherRoutes); 


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});