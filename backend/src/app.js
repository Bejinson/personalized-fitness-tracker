const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');

const app = express();

app.use(cors({
  origin: [
    "https://personalized-fitness-tracker-frontend.onrender.com",
    "http://localhost:5173"
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

module.exports = app;
