import React, { useState } from 'react'
import api from '../utils/api'

export default function WorkoutForm({ onCreated }) {
  const [type, setType] = useState('Running')
  const [duration, setDuration] = useState(30)
  const [calories, setCalories] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = { type, durationMinutes: Number(duration), calories: calories ? Number(calories) : undefined }
      const res = await api.post('/api/workouts', payload)
      setType('Running'); setDuration(30); setCalories('')
      onCreated && onCreated(res.data)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || err.message)
    }
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }} className="card">
      <div className="top-row">
        <div>
          <strong>Log a workout</strong>
          <div className="muted">Add a quick entry to your history</div>
        </div>
        <div>
          <button className="btn" type="submit">Add</button>
        </div>
      </div>
      <div className="form-row">
        <input value={type} onChange={e=>setType(e.target.value)} />
        <input type="number" value={duration} onChange={e=>setDuration(e.target.value)} />
        <input type="number" value={calories} onChange={e=>setCalories(e.target.value)} placeholder="Calories (optional)" />
      </div>
    </form>
  )
}
