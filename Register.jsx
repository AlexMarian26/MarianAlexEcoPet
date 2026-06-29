import { useState } from 'react'
import { supabase } from '../supabase'

export default function Register({ setView }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg("Te rugăm să introduci o adresă de email validă (ex: nume@domeniu.com)")
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMsg(error.message)
    else setMsg("Cont creat! Te poti autentifica!")
  }

  return (
    <div className="max-w-md mx-auto py-20 animate-fade-in">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <h2 className="text-3xl font-black mb-8 text-center italic text-green-700">Cont Nou</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Parolă" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-950 transition-all shadow-lg">Înregistrare</button>
        </form>
        {msg && <p className="mt-4 text-center text-xs font-bold text-slate-500">{msg}</p>}
        <p className="mt-6 text-center text-sm text-slate-400">Ai deja cont? <button onClick={() => setView('login')} className="text-green-600 font-bold">Loghează-te</button></p>
      </div>
    </div>
  )
}