const Workout = require('../models/Workout');

exports.createWorkout = async (req, res) => {
  try {
    const payload = { ...req.body, user: req.user._id };
    const w = await Workout.create(payload);
    res.json(w);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data' });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const list = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getWeeklyStats = async (req, res) => {
  try {
    // last 7 days totals of durationMinutes and calories
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 6);
    from.setHours(0,0,0,0);

    const pipeline = [
      { $match: { user: req.user._id, date: { $gte: from } } },
      { $project: { day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, durationMinutes: 1, calories: 1 } },
      { $group: { _id: "$day", totalMinutes: { $sum: "$durationMinutes" }, totalCalories: { $sum: { $ifNull: ["$calories", 0] } } } },
      { $sort: { _id: 1 } }
    ];

    const results = await Workout.aggregate(pipeline).exec();
    // fill last 7 days with zeros for missing days
    const out = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); const key = d.toISOString().slice(0,10)
      const found = results.find(r => r._id === key)
      out.push({ date: key, totalMinutes: found ? found.totalMinutes : 0, totalCalories: found ? found.totalCalories : 0 })
    }
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getMonthlyStats = async (req, res) => {
  try {
    // last 6 months totals
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const pipeline = [
      { $match: { user: req.user._id, date: { $gte: start } } },
      { $project: { month: { $dateToString: { format: "%Y-%m", date: "$date" } }, durationMinutes: 1, calories: 1 } },
      { $group: { _id: "$month", totalMinutes: { $sum: "$durationMinutes" }, totalCalories: { $sum: { $ifNull: ["$calories", 0] } } } },
      { $sort: { _id: 1 } }
    ];

    const results = await Workout.aggregate(pipeline).exec();
    // fill last 6 months with zeros
    const out = []
    const ref = now
    for (let i = 5; i >= 0; i--) {
      const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth()+1}`
      const found = results.find(r => r._id === key)
      out.push({ month: key, label: d.toLocaleString(undefined,{ month: 'short', year: 'numeric' }), totalMinutes: found ? found.totalMinutes : 0, totalCalories: found ? found.totalCalories : 0 })
    }
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getWorkout = async (req, res) => {
  try {
    const w = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!w) return res.status(404).json({ error: 'Not found' });
    res.json(w);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const w = await Workout.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!w) return res.status(404).json({ error: 'Not found' });
    res.json(w);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const w = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!w) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
};
