const KEY = 'pft_auth'

const save = ({ token, user }) => {
  if (!token) return
  localStorage.setItem(KEY, JSON.stringify({ token, user }))
}

const clear = () => localStorage.removeItem(KEY)

const get = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } catch (e) {
    return null
  }
}

const getToken = () => get()?.token || null
const getUser = () => get()?.user || null

export default { save, clear, get, getToken, getUser }
