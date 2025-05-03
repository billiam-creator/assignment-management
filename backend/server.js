const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); 
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignment');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});