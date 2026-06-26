import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  ArrowLeft, ShoppingCart, Heart, Star, Send, 
  Loader2, Sparkles, CreditCard, Trash2, Edit3, X, Save 
} from 'lucide-react';

export default function DetaliiProdus({ produs, wishlist, toggleWishlist, handleAddToCart, goBack, user, userRole, setView }) {
  const [recenzii, setRecenzii] = useState([]);
  const [loadingRecenzii, setLoadingRecenzii] = useState(true);
  const [rating, setRating] = useState(0); 
  const [comentariu, setComentariu] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notif, setNotif] = useState(null);

  
  const [editId, setEditId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComentariu, setEditComentariu] = useState('');

  useEffect(() => {
    if (produs) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      fetchRecenzii();
    }
  }, [produs]);

  if (!produs) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-green-600 w-12 h-12" /></div>;

  async function fetchRecenzii() {
    setLoadingRecenzii(true);
    try {
      const { data, error } = await supabase
        .from('recenzii')
        .select(`
          id, 
          stele, 
          comentariu, 
          created_at, 
          profile:utilizator_id (nume, prenume)
        `)
        .eq('produs_id', produs.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRecenzii(data || []);
    } catch (err) { 
      console.error("Eroare recenzii:", err.message); 
    } finally { 
      setLoadingRecenzii(false); 
    }
  }

 
  async function handleDelete(id) {
    if(confirm('Ștergi definitiv această recenzie?')) {
      const { error } = await supabase.from('recenzii').delete().eq('id', id);
      if(!error) {
        setRecenzii(recenzii.filter(r => r.id !== id));
        setNotif({ text: 'Recenzie eliminată!' });
      }
    }
  }

  async function handleUpdate(id) {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('recenzii')
        .update({ stele: editRating, comentariu: editComentariu })
        .eq('id', id);
      
      if (error) throw error;
      setEditId(null);
      fetchRecenzii();
      setNotif({ text: 'Recenzie actualizată!' });
    } catch (err) {
      setNotif({ text: 'Eroare la salvare!' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!user) return setNotif({ text: 'Loghează-te!' });
    if (rating === 0) return setNotif({ text: 'Alege nota!' });
    setSubmitting(true);
    try {
      await supabase.from('recenzii').insert([{ produs_id: produs.id, utilizator_id: user.id, stele: rating, comentariu }]);
      setComentariu(''); setRating(0); fetchRecenzii();
      setNotif({ text: 'Publicat!' });
    } catch (err) { setNotif({ text: 'Eroare!' }); } finally { setSubmitting(false); }
  }

  const isFavorite = wishlist.some(fav => fav.id === produs.id);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 pb-20">
      {notif && <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-3 rounded-full shadow-2xl font-black text-[10px] uppercase tracking-widest border border-green-500">{notif.text}</div>}
      
      <button onClick={goBack} className="flex items-center gap-2 text-slate-400 font-black mb-8 text-[9px] uppercase tracking-[0.3em] hover:text-green-600 transition-all">
        <ArrowLeft size={14} /> Înapoi
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="relative">
          <div className="aspect-square w-full overflow-hidden rounded-[2.5rem] shadow-xl border-2 border-white">
            <img src={produs.imagine_url} className="w-full h-full object-cover" alt={produs.nume} />
          </div>
          <button onClick={() => toggleWishlist(produs)} className="absolute top-5 right-5 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:scale-110 active:scale-75 transition-all">
            <Heart size={24} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-200'}`} />
          </button>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[9px] font-black uppercase tracking-widest self-start border border-green-100">
            <Sparkles size={10}/> Luxury Selection
          </div>
          <h1 className="text-5xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">{produs.nume}</h1>
          <p className="text-5xl font-black text-green-600 tracking-tighter">{produs.pret} <span className="text-xl text-slate-300 italic font-normal ml-1">RON</span></p>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-slate-500 text-lg leading-relaxed italic font-medium">{produs.descriere || "Experiență sustenabilă ECOPET Universe."}</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => handleAddToCart(produs)} disabled={produs.stoc === 0} className="flex-1 bg-slate-100 text-slate-900 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-200 transition-all disabled:opacity-30"><ShoppingCart size={18} /> Coș</button>
            <button onClick={() => { handleAddToCart(produs); setView('checkout'); }} disabled={produs.stoc === 0} className="flex-1 bg-green-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-slate-900 shadow-xl transition-all active:scale-95 disabled:opacity-30">Cumpără</button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Review-uri <span className="text-green-600">Clienți</span></h2>
          
          {loadingRecenzii ? (
            <div className="py-10"><Loader2 className="animate-spin text-green-600" /></div>
          ) : recenzii.length > 0 ? (
            recenzii.map(r => (
              <div key={r.id} className={`bg-white p-8 rounded-[2.5rem] border shadow-sm transition-all ${editId === r.id ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-100'}`}>
                
                {editId === r.id ? (
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setEditRating(s)}>
                          <Star size={16} className={s <= editRating ? "fill-orange-400 text-orange-400" : "text-slate-200"} />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={editComentariu} 
                      onChange={e => setEditComentariu(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-orange-200 rounded-2xl outline-none italic text-sm font-medium"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(r.id)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-all">
                        <Save size={14}/> Salvează
                      </button>
                      <button onClick={() => setEditId(null)} className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest">
                        <X size={14}/> Anulează
                      </button>
                    </div>
                  </div>
                ) : (
                 
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < r.stele ? "fill-yellow-400 text-yellow-400" : "text-slate-100"} />
                        ))}
                      </div>

                      {userRole === 'admin' && (
                        <div className="flex gap-2">
                          <button onClick={() => { setEditId(r.id); setEditRating(r.stele); setEditComentariu(r.comentariu); }} className="p-2 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-slate-700 text-lg italic mb-6 font-medium">"{r.comentariu}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-0.5 bg-green-500 rounded-full"></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                        {r.profile ? `${r.profile.prenume} ${r.profile.nume}` : 'Client ECOPET'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-300 italic text-sm font-black uppercase tracking-widest py-10">Nicio recenzie încă</p>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="p-10 rounded-[3rem] text-white shadow-xl bg-slate-900 sticky top-24">
            <h3 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Opinia ta</h3>
            <div className="space-y-6">
              <div className="flex justify-center gap-3 bg-white/5 py-5 rounded-[2rem] border border-white/5">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)} className="transition-all hover:scale-125">
                    <Star size={24} className={`${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-white/5"}`} />
                  </button>
                ))}
              </div>
              <textarea 
                value={comentariu} 
                onChange={e => setComentariu(e.target.value)} 
                className="w-full bg-white/5 rounded-[1.5rem] p-6 text-base border border-white/10 outline-none focus:border-green-500 font-medium placeholder:text-slate-700" 
                placeholder={user ? "Scrie aici..." : "Trebuie să fii logat!"} 
                disabled={!user}
                rows="4"
              ></textarea>
              <button 
                disabled={submitting || !user} 
                onClick={handleSubmitReview} 
                className="w-full bg-green-600 py-5 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 hover:bg-white hover:text-slate-900 transition-all disabled:opacity-20 shadow-md"
              >
                <Send size={14} /> Trimite Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}