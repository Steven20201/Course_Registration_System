const express = require('express');
const connectDB = require('./config/db');
const { ROLES, GRADE_PASS, GRADE_FAIL, GRADE_WITHDRAWN } = require('./config/constants');
const app = express();

// Connect to MongoDB
connectDB();