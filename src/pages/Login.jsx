import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login({ setView }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError("Email sau parolă greșită!")
    else setView('produse')
  }

  return (
    <div className="max-w-md mx-auto py-20 animate-fade-in">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <h2 className="text-3xl font-black mb-8 text-center italic">Log In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Parolă" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-950 transition-all">Intră în cont</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Nu ai cont? <button onClick={() => setView('register')} className="text-green-600 font-bold">Înregistrează-te</button></p>
      </div>
    </div>
  )
}