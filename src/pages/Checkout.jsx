import { useState } from 'react';
import { supabase } from '../supabase';
import { CreditCard, Truck, ArrowLeft, Loader2, Lock, CheckCircle, ShieldCheck, Sparkles, Mail } from 'lucide-react';

export default function Checkout({ cart, total, user, setView, clearCart, userPoints, setUserPoints }) {
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [formData, setFormData] = useState({
    nume: '', prenume: '', email: user?.email || '', telefon: '', adresa: '', oras: '', metoda: 'Card'
  });

  const taxaTransport = total > 200 ? 0 : 15;
  const valoareReducere = userPoints / 10; 
  const sumaInitiala = total + taxaTransport;
  const reducereAplicata = usePoints ? Math.min(sumaInitiala, valoareReducere) : 0;
  const totalFinal = Number((sumaInitiala - reducereAplicata).toFixed(2));

  async function handleOrder(e) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { data: order, error: dbError } = await supabase.from('comanda').insert([{
          utilizator_id: user.id, nume: formData.nume, prenume: formData.prenume,
          email: formData.email, telefon: formData.telefon, adresa: formData.adresa,
          oras: formData.oras, metoda: formData.metoda, total: totalFinal
      }]).select().single();

      if (dbError) throw dbError;

      const itemsComanda = cart.map(item => ({
        comanda_id: order.id, produs_id: item.id, nume_produs: item.nume,
        cantitate: item.quantity, imagine_url: item.imagine_url
      }));
      await supabase.from('comanda_item').insert(itemsComanda);

      for (const item of cart) {
        const { data: cur } = await supabase.from('produs').select('stoc').eq('id', item.id).single();
        await supabase.from('produs').update({ stoc: Math.max(0, (cur?.stoc || 0) - item.quantity) }).eq('id', item.id);
      }

      supabase.functions.invoke('send-order-email', { body: { order, items: itemsComanda, userEmail: formData.email } }).catch(e => {});
      
      let noulBalans = usePoints ? (userPoints - Math.floor(reducereAplicata * 10)) : (userPoints + Math.floor(totalFinal));
      await supabase.from('profile').update({ puncte: Math.max(0, noulBalans) }).eq('id', user.id);
      setUserPoints(Math.max(0, noulBalans));

    
      if (formData.metoda === 'Card') {
        const { data } = await supabase.functions.invoke('create-checkout', { 
          body: { nume: `ECOPET Universe #${String(order.id).slice(0,5)}`, pret: totalFinal, imagine: cart[0]?.imagine_url } 
        });
        if (data?.url) window.location.href = data.url;
      } else {
        setOrderComplete(true);
        clearCart();
      }
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  }

  if (orderComplete) return (
    <div className="flex flex-col items-center justify-center py-40 text-center bg-white animate-fade-in">
      <div className="w-32 h-32 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl"><CheckCircle size={60} /></div>
      <h2 className="text-6xl font-black italic mb-4 uppercase tracking-tighter text-slate-900">Vă mulțumim!</h2>
      <p className="text-emerald-600 font-black uppercase text-[12px] tracking-[0.4em]">Comanda ta ECOPET Universe a fost înregistrată</p>
      <button onClick={() => setView('produse')} className="px-14 py-6 bg-slate-950 text-white rounded-3xl font-black uppercase text-[11px] mt-16 hover:scale-105 transition-all shadow-2xl">Înapoi la Magazin</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 bg-white min-h-screen">
      <button onClick={() => setView('cos')} className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase mb-16 tracking-widest hover:text-emerald-600"><ArrowLeft size={16} /> Înapoi la Coș</button>
      
      <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Finalizare Comandă</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input required placeholder="Nume" value={formData.nume} onChange={e => setFormData({...formData, nume: e.target.value})} className="p-7 bg-white border-2 border-slate-300 rounded-[2.5rem] font-bold focus:border-emerald-500 outline-none transition-all" />
              <input required placeholder="Prenume" value={formData.prenume} onChange={e => setFormData({...formData, prenume: e.target.value})} className="p-7 bg-white border-2 border-slate-300 rounded-[2.5rem] font-bold focus:border-emerald-500 outline-none transition-all" />
            </div>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email de contact" className="w-full p-7 bg-white border-2 border-slate-300 rounded-[2.5rem] font-bold focus:border-emerald-500 outline-none" />
            <input required placeholder="Adresă Livrare" value={formData.adresa} onChange={e => setFormData({...formData, adresa: e.target.value})} className="w-full p-7 bg-white border-2 border-slate-300 rounded-[2.5rem] font-bold focus:border-emerald-500 outline-none" />
            <div className="grid grid-cols-2 gap-6">
              <input required placeholder="Oraș" value={formData.oras} onChange={e => setFormData({...formData, oras: e.target.value})} className="p-7 bg-white border-2 border-slate-300 rounded-[2.5rem] font-bold focus:border-emerald-500" />
              <input required placeholder="Telefon" value={formData.telefon} onChange={e => setFormData({...formData, telefon: e.target.value})} className="p-7 bg-white border-2 border-slate-300 rounded-[2.5rem] font-bold focus:border-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-14 rounded-[4rem] text-white shadow-2xl sticky top-10 overflow-hidden">
            <h3 className="text-xl font-black italic mb-12 uppercase flex items-center gap-3"><Lock size={18} className="text-emerald-400" /> Rezumat Plată</h3>
            
            {userPoints > 0 && (
              <div className="mb-12 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400"><Sparkles size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500">Puncte disponibile: {userPoints}</p>
                    <p className="text-lg font-black text-emerald-400">Reducere -{valoareReducere.toFixed(2)} RON</p>
                  </div>
                </div>
                <input type="checkbox" checked={usePoints} onChange={() => setUsePoints(!usePoints)} className="w-8 h-8 rounded-full accent-emerald-500 cursor-pointer" />
              </div>
            )}

            <div className="space-y-5 mb-12 border-b border-white/5 pb-10 font-bold">
              <div className="flex justify-between text-slate-400"><span>Produse</span><span>{total.toFixed(2)} RON</span></div>
              <div className="flex justify-between text-slate-400"><span>Transport</span><span>{taxaTransport} RON</span></div>
              {usePoints && <div className="flex justify-between text-emerald-400"><span>Reducere Puncte</span><span>-{reducereAplicata.toFixed(2)} RON</span></div>}
              <div className="flex justify-between text-5xl font-black pt-10 text-white italic tracking-tighter uppercase">
                <span>Total</span><span className="text-emerald-400">{totalFinal.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
                <button type="button" onClick={() => setFormData({...formData, metoda: 'Card'})} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${formData.metoda === 'Card' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 text-slate-600'}`}><CreditCard size={28} /><span className="text-[10px] font-black uppercase tracking-widest">Card Online</span></button>
                <button type="button" onClick={() => setFormData({...formData, metoda: 'Cash'})} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${formData.metoda === 'Cash' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 text-slate-600'}`}><Truck size={28} /><span className="text-[10px] font-black uppercase tracking-widest">La Livrare</span></button>
            </div>

            <button disabled={loading} className="w-full bg-emerald-500 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-4">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />} Plasează Comanda
            </button>
        </div>
      </form>
    </div>
  );
}