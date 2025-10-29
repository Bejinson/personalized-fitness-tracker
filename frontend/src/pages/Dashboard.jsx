import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import WorkoutForm from '../components/WorkoutForm'
import WorkoutList from '../components/WorkoutList'
import Stats from '../components/Stats'
import ProgressSummary from '../components/ProgressSummary'

export default function Dashboard() {
  const [items, setItems] = useState([])

  const load = async () => {
    try {
      const res = await api.get('/api/workouts')
      setItems(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(()=>{ load() }, [])

  const onCreated = (w) => setItems(prev=>[w, ...prev])
  const onRemoved = (id) => setItems(prev=>prev.filter(p=>p._id !== id))

  const generateDemo = async () => {
    try {
      // create sample workouts over the last 10 days
      const sample = [
        { type: 'Running', durationMinutes: 30, calories: 320 },
        { type: 'Cycling', durationMinutes: 45, calories: 520 },
        { type: 'Weight Lifting', durationMinutes: 60, calories: 420 },
      ]
      for (let i = 0; i < 7; i++) {
        const d = new Date(); d.setDate(d.getDate() - i)
        const s = sample[i % sample.length]
        await api.post('/api/workouts', { ...s, date: d.toISOString() })
      }
      await load()
    } catch (err) { console.error('demo failed', err) }
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h2>Dashboard</h2>
          <p>Log a new workout and view your history below.</p>
        </div>
        <div>
          <button className="btn" onClick={generateDemo}>Generate demo data</button>
        </div>
      </div>

      <ProgressSummary workouts={items} />

      <WorkoutForm onCreated={onCreated} />
  <Stats workouts={items} />
  <WorkoutList items={items} onRemoved={onRemoved} />
    </div>
  )
}
