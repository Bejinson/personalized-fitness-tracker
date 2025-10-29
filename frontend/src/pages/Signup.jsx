import React, { useState } from 'react'
import api from '../utils/api'
import auth from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)

  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/signup', { name, email, password })
      auth.save(res.data)
      setMsg('Signed up — token saved')
      navigate('/')
    } catch (err) {
      setMsg(err.response?.data?.error || err.message)
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">Signup</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
