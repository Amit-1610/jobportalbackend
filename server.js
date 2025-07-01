require('dotenv').config();
const morgan = require("morgan");
const connectDB = require("./config/db");
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const errorHandler = require('./middlewares/errorHanlder');

// MongoDB connection
connectDB();

const app = express();

// --------- CORS CONFIG -----------
const FRONTEND_ORIGIN = 'http://localhost:5173';
const corsOptions = {
  origin: FRONTEND_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions)); // Apply CORS to all routes
// ----------------------------------

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug CORS
app.use((req, res, next) => {
  console.log('[CORS DEBUG] Incoming Origin:', req.headers.origin);
  res.on('finish', () => {
    console.log('[CORS DEBUG] Access-Control-Allow-Origin sent:', res.get('Access-Control-Allow-Origin'));
  });
  next();
});

// Create HTTP server and Socket.io
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    credentials: true, // This is crucial if you use authentication with sockets
  }
});

// Socket.io logs
io.on('connection', (socket) => {
  console.log(`Socket is now connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io available in routes
app.set('io', io);

// Routes
const authRoutes = require('./routes/authRoutes');
const employerRoutes = require('./routes/employerRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const collegeStudentRoutes = require('./routes/collegeStudentRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const agencyStudentRoutes = require('./routes/agencyStudentRoutes');
const jobSeekerRoutes = require('./routes/jobSeekerRoutes');
const jobRoutes = require('./routes/jobRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/college-students', collegeStudentRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/agency-students', agencyStudentRoutes);
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/jobs', jobRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
