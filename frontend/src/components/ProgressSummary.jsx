import React, { useMemo } from 'react'

function fmtNumber(n){ return n == null ? '-' : n.toLocaleString() }

function dateKey(d){ return d.toISOString().slice(0,10) }

export default function ProgressSummary({ workouts = [] }){
  const summary = useMemo(()=>{
    const now = new Date()
    const start = new Date(); start.setDate(now.getDate() - 6); start.setHours(0,0,0,0)

    let weekWorkouts = 0
    let weekMinutes = 0
    let weekCalories = 0

    let totalWorkouts = 0
    let totalMinutes = 0
    let totalCalories = 0

    const dateSet = new Set()

    for (const w of workouts){
      totalWorkouts++
      totalMinutes += Number(w.durationMinutes || 0)
      totalCalories += Number(w.calories || 0)
      const d = w.date ? new Date(w.date) : new Date(w.createdAt)
      const key = dateKey(d)
      dateSet.add(key)
      if (d >= start){
        weekWorkouts++
        weekMinutes += Number(w.durationMinutes || 0)
        weekCalories += Number(w.calories || 0)
      }
    }

    // compute streak: consecutive days up to today that have at least one workout
    let streak = 0
    const today = new Date(); today.setHours(0,0,0,0)
    for (let i=0;;i++){
      const d = new Date(today); d.setDate(today.getDate() - i)
      const k = dateKey(d)
      if (dateSet.has(k)) streak++
      else break
      // avoid infinite loop
      if (i>365) break
    }

    // badges / milestones
    const badges = [
      { id: 'minutes-1000', label: '1,000 minutes logged', achieved: totalMinutes >= 1000 },
      { id: 'workouts-50', label: '50 workouts completed', achieved: totalWorkouts >= 50 },
      { id: 'calories-10000', label: '10,000 kcal burned', achieved: totalCalories >= 10000 },
    ]

    return {
      weekWorkouts, weekMinutes, weekCalories,
      totalWorkouts, totalMinutes, totalCalories,
      streak, badges
    }
  }, [workouts])

  return (
    <div className="summary-cards">
      <div className="summary-card card">
        <div className="top-row">
          <div>
            <div className="muted">This Week</div>
            <div style={{fontWeight:700,fontSize:16}}>{summary.weekWorkouts} Workouts • {fmtNumber(summary.weekMinutes)} min • {fmtNumber(summary.weekCalories)} kcal</div>
          </div>
          <div className="muted">Streak: <strong>{summary.streak}d</strong></div>
        </div>
      </div>

      <div className="summary-card card">
        <div className="muted">All Time</div>
        <div style={{fontWeight:700,fontSize:16}}>{summary.totalWorkouts} Workouts • {fmtNumber(summary.totalMinutes)} min • {fmtNumber(summary.totalCalories)} kcal</div>
        <div style={{marginTop:10,display:'flex',gap:8,flexWrap:'wrap'}}>
          {summary.badges.map(b=> (
            <div key={b.id} className={"badge " + (b.achieved ? 'achieved':'')}>{b.label}{b.achieved ? ' ✓' : ''}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
