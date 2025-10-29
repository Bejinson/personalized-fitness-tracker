const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/workoutController');
const { getWeeklyStats, getMonthlyStats } = require('../controllers/workoutController');

router.use(auth);

router.post('/', controller.createWorkout);
router.get('/', controller.getWorkouts);
router.get('/stats/weekly', controller.getWeeklyStats);
router.get('/stats/monthly', controller.getMonthlyStats);
router.get('/:id', controller.getWorkout);
router.put('/:id', controller.updateWorkout);
router.delete('/:id', controller.deleteWorkout);

module.exports = router;
