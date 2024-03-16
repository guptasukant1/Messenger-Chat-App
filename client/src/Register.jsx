import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  async function register(ev) {
    ev.preventDefault()
    await axios.post('/register', {username, password})
  }
  return (
    <div className='bg-blue-100 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12' onSubmit={register}>
        <input value={username}
        onChange={ev => setUsername(ev.target.value)}
        type="text"
        placeholder='username'
        className='block w-full rounded-sm p-2 mb-2 border' />
        <input value={password}
        onChange={ev=> setPassword(ev.target.value)}
        type="password"
        placeholder='password'
        className='block w-full rounded-sm p-2 mb-2 border' />
        <button type='submit' className='bg-blue-500 text-white block w-full rounded-sm p-2'>Register</button>
      </form>
    </div>
  )
}

