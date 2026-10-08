const express = require('express');
const connectDB = require('./config/db');

const app = express();
const userRoutes = require('./routes/UserRoute');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/CourseRoutes')
const offeringRoutes = require('./routes/offeringRoutes')
const registrationRoutes = require('./routes/registrationRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recordRoutes = require('./routes/recordRoutes');
const meRoutes = require('./routes/meRoutes');
const PORT = process.env.PORT || 5000;
const cors = require('cors'); 

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes
// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/offerings', offeringRoutes);
app.use('/api/registrations', registrationRoutes)
app.use('/api/me', meRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the User Management API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});