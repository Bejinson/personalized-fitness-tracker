import React from 'react'
import auth from '../utils/auth'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg'

export default function Header(){
  const navigate = useNavigate()
  const user = auth.getUser()
  const logout = ()=>{ auth.clear(); navigate('/login'); window.location.reload() }

  return (
    <header className="header">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src={Logo} alt="logo" style={{width:44,height:44,borderRadius:8}} />
        <div className="brand">Personalized Fitness</div>
      </div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        {user ? (
          <><span className="muted">|</span> <span className="muted">{user.name}</span> <button className="btn ghost" onClick={logout}>Logout</button></>
        ) : (
          <><Link to="/signup">Signup</Link> <Link to="/login">Login</Link></>
        )}
      </div>
    </header>
  )
}
