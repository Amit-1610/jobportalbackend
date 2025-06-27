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
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}
app.use(cors(corsOptions));

// Socket.IO logs
io.on('connection', (socket) => {
  console.log(`Socket is now connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const employerRoutes = require('./routes/employerRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const jobSeekerRoutes = require('./routes/jobSeekerRoutes');

app.use('/api/employers', employerRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/auth', authRoutes);

// Error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
