import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import api from '../utils/api'

export default function Stats() {
  const [weekly, setWeekly] = useState([])
  const [monthly, setMonthly] = useState([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const w = await api.get('/api/workouts/stats/weekly')
        const m = await api.get('/api/workouts/stats/monthly')
        if (!mounted) return
        // transform weekly: { _id: 'YYYY-MM-DD', totalMinutes, totalCalories } -> { dateLabel, minutes }
        const wdata = []
        // ensure last 7 days present
        for (let i = 6; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i); const key = d.toISOString().slice(0,10)
          // backend may return { _id: 'YYYY-MM-DD' } or { date: 'YYYY-MM-DD' }
          const found = w.data.find(x => x._id === key || x.date === key)
          wdata.push({ dateLabel: d.toLocaleDateString(), minutes: found ? (found.totalMinutes ?? found.totalMinutes === 0 ? found.totalMinutes : found.totalMinutes) : 0 })
        }
        const mdata = []
        // build last 6 months labels
        const now = new Date()
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const key = `${d.getFullYear()}-${d.getMonth()+1}`
          // backend may return { _id: 'YYYY-M' } or { month: 'YYYY-M' }
          const found = m.data.find(x => x._id === key || x.month === key)
          mdata.push({ label: d.toLocaleString(undefined,{ month: 'short', year: 'numeric' }), calories: found ? (found.totalCalories ?? found.totalCalories === 0 ? found.totalCalories : found.totalCalories) : 0 })
        }
        setWeekly(wdata)
        setMonthly(mdata)
      } catch (err) {
        console.error('Failed to load stats', err)
      }
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
      <div style={{ minHeight: 200 }}>
        <h4>Last 7 days — minutes</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekly}>
            <XAxis dataKey="dateLabel" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ minHeight: 200 }}>
        <h4>Last 6 months — calories</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
