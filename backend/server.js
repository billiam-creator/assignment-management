require('dotenv').config(); // <--- THIS SHOULD BE AT THE VERY TOP

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignment');
const studentRoutes = require('./routes/students'); 
const teacherRoutes = require('./routes/teachers'); 
const adminRoutes = require('./routes/admin');
const requireAuth = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');
const isStudent = require('./middleware/isStudent');
const isTeacher = require('./middleware/isTeacher');
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
        const courses = await Course.find().select('_id name'); // Only return ID and name
        res.json(courses);
    } catch (error) {
        console.error('Error fetching public courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/students', requireAuth, isStudent, studentRoutes); 
app.use('/api/teachers', requireAuth, isTeacher, teacherRoutes); 
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});