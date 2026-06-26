import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Cos({ cart, setView, updateQuantity }) {
  const total = cart.reduce((acc, item) => acc + (item.pret * item.quantity), 0);

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center">
      <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-8"><ShoppingBag size={48} /></div>
      <h2 className="text-3xl font-black italic mb-4 tracking-tighter">Coșul tău este gol</h2>
      <button onClick={() => setView('produse')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-green-600 transition-all shadow-xl">Explorează Produse</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fade-in">
      <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-16 flex items-center gap-6">
        Coșul tău <span className="text-xs bg-slate-100 px-6 py-2 rounded-full not-italic text-slate-400 font-black">{cart.length} Produse</span>
      </h2>

      <div className="space-y-6 mb-16">
        {cart.map(item => (
          <div key={item.id} className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex items-center gap-8 group hover:shadow-md transition-all">
            <img src={item.imagine_url} className="w-28 h-28 object-cover rounded-3xl border shadow-sm" />
            <div className="flex-1">
              <h3 className="text-xl font-black italic text-slate-900">{item.nume}</h3>
              <p className="text-green-600 font-black text-lg">{item.pret} RON</p>
            </div>
            
            <div className="flex items-center bg-slate-50 rounded-2xl p-2 gap-4">
              <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><Minus size={16}/></button>
              <span className="font-black text-lg w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><Plus size={16}/></button>
            </div>

            
            <button 
              onClick={() => updateQuantity(item.id, -item.quantity)} 
              className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white hover:scale-110 active:scale-75 transition-all duration-300"
              title="Elimină din coș"
            >
              <Trash2 size={20} className="animate-pulse-subtle" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
        <div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Total de plată</p>
          <p className="text-5xl font-black text-green-400 italic tracking-tighter">{total.toFixed(2)} RON</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView('produse')} className="px-10 py-6 bg-white/5 hover:bg-white/10 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all">Magazin</button>
          <button onClick={() => setView('checkout')} className="px-12 py-6 bg-green-600 hover:bg-white hover:text-slate-900 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-xl active:scale-95">Finalizează</button>
        </div>
      </div>
    </div>
  );
}