import React from 'react'
import api from '../utils/api'

import RunningIcon from '../assets/running.svg'
import CyclingIcon from '../assets/cycling.svg'
import WeightIcon from '../assets/weight.svg'

export default function WorkoutList({ items, onRemoved }) {
  if (!items || items.length === 0) return <p className="muted">No workouts yet.</p>

  const remove = async (id) => {
    if (!confirm('Delete this workout?')) return
    try {
      await api.delete(`/api/workouts/${id}`)
      onRemoved && onRemoved(id)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    }
  }

  return (
    <div className="workout-list">
      {items.map(it => {
        let Icon = RunningIcon
        const t = (it.type||'').toLowerCase()
        if (t.includes('bike') || t.includes('cycle')) Icon = CyclingIcon
        if (t.includes('weight') || t.includes('lift')) Icon = WeightIcon
        return (
          <div className="workout-item card" key={it._id}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <img src={Icon} alt="icon" style={{width:40,height:40}} />
              <div>
                <strong>{it.type}</strong>
                <div className="muted">{it.durationMinutes} min {it.calories ? `• ${it.calories} kcal` : ''}</div>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <button className="btn ghost" onClick={()=>remove(it._id)}>Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
