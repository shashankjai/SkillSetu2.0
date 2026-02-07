const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const http     = require('http');
const socketIo = require('socket.io');
const path     = require('path');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');

// LOAD ENV ONCE, FORCE PATH (CRITICAL)
dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

// Debug (keep for now)
console.log('MONGO_URI =', process.env.MONGO_URI);

const User = require('./models/User');

// Routes
const authRoutes         = require('./routes/authRoutes');
const userRoutes         = require('./routes/userRoutes');
const matchRoutes        = require('./routes/matchRoutes');
const sessionRoutes      = require('./routes/sessionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes        = require('./routes/adminRoutes');
const reportRoutes       = require('./routes/reportRoutes');

// Socket setters
const { setSocketIO: setSessionSocketIO } =
  require('./controllers/sessionController');
const { setSocket: setNotificationSocketIO } =
  require('./controllers/notificationController');

// ─── APP & SERVER ──────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// ─── SOCKET.IO ─────────────────────────────────────────────────────
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Namespaces
const sessionSocket      = io.of('/sessions');
const notificationSocket = io.of('/notifications');

// Pass sockets to controllers
setSessionSocketIO(sessionSocket);
setNotificationSocketIO(notificationSocket);

// ─── MIDDLEWARE ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  '/uploads/profile-pictures',
  express.static(path.join(__dirname, 'uploads/profile-pictures'))
);
app.use(
  '/uploads/message-uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ─── DATABASE ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const {
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_NAME,
      ADMIN_PIC_URL,
    } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

    let admin = await User.findOne({ email: ADMIN_EMAIL });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(ADMIN_PASSWORD, salt);

      admin = new User({
        name: ADMIN_NAME || 'Administrator',
        email: ADMIN_EMAIL,
        password: hash,
        role: 'admin',
        profilePicture: ADMIN_PIC_URL
          ? path.basename(ADMIN_PIC_URL)
          : '',
      });

      await admin.save();
      console.log('Admin user created:', ADMIN_EMAIL);
    }
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err);
    process.exit(1);
  });

// ─── ROUTES ─────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// ─── SOCKET EVENTS ─────────────────────────────────────────────────
sessionSocket.on('connection', (socket) => {
  console.log('Session socket connected');

  const sessionId = socket.handshake.query.sessionId;
  console.log('Session ID:', sessionId);

  socket.on('disconnect', () => {
    console.log('Session socket disconnected');
  });
});

notificationSocket.on('connection', (socket) => {
  console.log('Notification socket connected');

  socket.on('disconnect', () => {
    console.log('Notification socket disconnected');
  });
});

// ─── DEFAULT ROUTE ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('SkillSwap API is running ');
});

// ─── START SERVER ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
