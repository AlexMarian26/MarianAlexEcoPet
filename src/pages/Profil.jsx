import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { User, Package, Save, Loader2, Sparkles, RefreshCw, CreditCard, Truck, Clock, ChevronDown, ChevronUp, MapPin, Check, X } from 'lucide-react'

export default function Profil({ user, userRole, userPoints }) {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fetchingOrders, setFetchingOrders] = useState(false)
  const [comenzi, setComenzi] = useState([])
  const [profileData, setProfileData] = useState({ nume: '', prenume: '', adresa: '', metoda_plata: 'Card' })
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (user) { getProfile(); getComenzi(); }
  }, [user])

  async function getProfile() {
    const { data } = await supabase.from('profile').select('*').eq('id', user.id).single()
    if (data) setProfileData(data)
    setLoading(false)
  }

  async function getComenzi() {
    setFetchingOrders(true)
    const { data } = await supabase
      .from('comanda')
      .select('*, comanda_item(*)')
      .eq('utilizator_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setComenzi(data);
    setFetchingOrders(false)
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setUpdating(true);
    const { error } = await supabase.from('profile').update(profileData).eq('id', user.id);
    setNotification(error ? { type: 'error', text: 'Eroare!' } : { type: 'success', text: 'Profil Salvat!' });
    setUpdating(false);
    setTimeout(() => setNotification(null), 3000);
  }

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-green-600 w-16 h-16" /></div>

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 animate-fade-in relative">
      {notification && (
        <div className={`fixed top-24 right-10 z-[100] flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl animate-bounce-in ${notification.type === 'success' ? 'bg-slate-900 text-white border border-green-500' : 'bg-red-600 text-white'}`}>
          {notification.type === 'success' ? <Check size={18} className="text-green-500" /> : <X size={18} />}
          <span className="font-black text-[10px] uppercase tracking-widest">{notification.text}</span>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-20">
        <div className="flex-1 space-y-12">
          <header className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 pb-12">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl"><User size={48} /></div>
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-none">Contul Meu</h1>
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${userRole === 'admin' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {userRole === 'admin' ? '🛡️ Admin' : '🐾 Client'}
                </span>
                <span className="bg-amber-50 text-amber-700 border border-amber-200 px-5 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-sm"><Sparkles size={14} className="fill-amber-500" /> {userPoints} Puncte</span>
                <span className="text-slate-500 text-[10px] font-black uppercase bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">{user?.email}</span>
              </div>
            </div>
          </header>

          <form onSubmit={handleUpdate} className="bg-white p-12 rounded-[4rem] border border-slate-50 space-y-10 shadow-sm">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nume</label>
                <input value={profileData.nume || ''} onChange={e => setProfileData({...profileData, nume: e.target.value})} className="p-6 bg-slate-50 rounded-[2rem] w-full font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Prenume</label>
                <input value={profileData.prenume || ''} onChange={e => setProfileData({...profileData, prenume: e.target.value})} className="p-6 bg-slate-50 rounded-[2rem] w-full font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all" />
              </div>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2"><MapPin size={12}/> Adresă de Livrare</label>
                <textarea value={profileData.adresa || ''} onChange={e => setProfileData({...profileData, adresa: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all" rows="3"></textarea>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2"><CreditCard size={12}/> Metodă de Plată Preferată</label>
                <select value={profileData.metoda_plata || 'Card'} onChange={e => setProfileData({...profileData, metoda_plata: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-bold outline-none cursor-pointer">
                  <option value="Card">💳 Card Bancar</option>
                  <option value="Cash">💵 Cash la Livrare</option>
                </select>
            </div>
            <button type="submit" disabled={updating} className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black uppercase text-[12px] flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-xl">
              {updating ? <Loader2 className="animate-spin" /> : <Save />} Salvează Modificările
            </button>
          </form>
        </div>

        <div className="w-full xl:w-[500px]">
          <div className="bg-slate-900 rounded-[4.5rem] p-12 text-white shadow-2xl sticky top-28 h-[800px] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black italic text-3xl uppercase tracking-tighter flex items-center gap-4"><Package size={32} className="text-green-400" /> Istoric</h3>
              <button onClick={getComenzi} className="p-3 hover:bg-white/10 rounded-full transition-all"><RefreshCw size={22} className={fetchingOrders ? "animate-spin" : ""} /></button>
            </div>
            <div className="space-y-6 overflow-y-auto pr-3 custom-scrollbar flex-1">
              {comenzi.length > 0 ? comenzi.map((cmd) => (
                <div key={cmd.id} className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden transition-all hover:bg-white/10">
                  <button onClick={() => setExpandedOrder(expandedOrder === cmd.id ? null : cmd.id)} className="w-full p-8 flex flex-col gap-4 text-left">
                    <div className="flex justify-between items-start w-full">
                      <span className="text-[9px] font-black text-green-400 uppercase bg-green-400/10 px-3 py-1 rounded-lg">ID: {cmd.id.slice(0, 8)}</span>
                      {expandedOrder === cmd.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    <div className="flex justify-between items-end w-full">
                      <p className="text-4xl font-black tracking-tighter">{cmd.total.toFixed(2)} <span className="text-sm text-green-500 font-normal">RON</span></p>
                      <span className="text-[11px] font-bold text-slate-500">{new Date(cmd.created_at).toLocaleDateString()}</span>
                    </div>
                  </button>
                  {expandedOrder === cmd.id && (
                    <div className="px-8 pb-10 pt-4 border-t border-white/5 bg-black/20 animate-slide-down">
                      <div className="space-y-5">
                        {cmd.comanda_item?.map((item) => (
                          <div key={item.id} className="flex items-center gap-5 bg-white/5 p-4 rounded-3xl">
                            <img src={item.imagine_url} className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                            <div className="flex-1">
                              <p className="text-[11px] font-bold uppercase text-white leading-tight">{item.nume_produs}</p>
                              <p className="text-[9px] text-green-400 mt-1 uppercase font-black">Cantitate: {item.cantitate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-2">
                           {cmd.metoda === 'Card' ? <CreditCard size={14} className="text-blue-400" /> : <Truck size={14} className="text-amber-400" />}
                           <span className="text-[9px] font-black uppercase tracking-widest">{cmd.metoda}</span>
                        </div>
                        <div className="flex items-center gap-2"><Clock size={12}/> <span className="text-[9px] font-bold">{new Date(cmd.created_at).toLocaleTimeString()}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-24 opacity-30 italic"><Package size={64} className="mx-auto mb-6 opacity-10" /><p className="text-[12px] font-black uppercase tracking-widest">Nicio comandă găsită</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}