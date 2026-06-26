import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Plus, Package, Trash2, Edit3, Upload, Loader2, Check, X, Box, Layers, Star, MessageSquare, Save } from 'lucide-react';

export default function Admin({ onProductAdded, showNotification }) {
  const [produse, setProduse] = useState([]);
  const [recenzii, setRecenzii] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  

  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    nume: '', pret: '', categorie_id: '2', imagine_url: '', descriere: '', stoc: '0'
  });

  const [editReviewMode, setEditReviewMode] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [reviewFormData, setReviewFormData] = useState({ stele: 5, comentariu: '' });

  useEffect(() => { 
    fetchProduse(); 
    fetchRecenzii();
  }, []);

  async function fetchProduse() {
    const { data } = await supabase.from('produs').select('*').order('id', { ascending: false });
    if (data) setProduse(data);
  }

  async function fetchRecenzii() {
    const { data } = await supabase
      .from('recenzii')
      .select('*, profile:utilizator_id(nume, prenume), produs:produs_id(nume)')
      .order('created_at', { ascending: false });
    if (data) setRecenzii(data);
  }

  async function handleFileUpload(e) {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('produse').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('produse').getPublicUrl(fileName);
      setFormData({ ...formData, imagine_url: publicUrl });
      if(showNotification) showNotification("Imagine încărcată!");
    } catch (error) { 
      if(showNotification) showNotification("Eroare upload!", "error");
    } finally { setUploading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = { 
        nume: formData.nume,
        pret: parseFloat(formData.pret),
        categorie_id: parseInt(formData.categorie_id),
        imagine_url: formData.imagine_url,
        descriere: formData.descriere,
        stoc: parseInt(formData.stoc)
    };
    try {
      if (editMode) {
        await supabase.from('produs').update(payload).eq('id', currentId);
      } else {
        await supabase.from('produs').insert([payload]);
      }
      setFormData({ nume: '', pret: '', categorie_id: '2', imagine_url: '', descriere: '', stoc: '0' });
      setEditMode(false);
      fetchProduse();
      if (onProductAdded) onProductAdded();
      if(showNotification) showNotification("Catalog ECOPET actualizat!");
    } catch (err) { 
      if(showNotification) showNotification(err.message, "error");
    } finally { setLoading(false); }
  }

  function handleEditRecenzie(r) {
    setEditReviewMode(true);
    setCurrentReviewId(r.id);
    setReviewFormData({ stele: r.stele, comentariu: r.comentariu });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  async function handleUpdateRecenzie(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('recenzii')
        .update({ stele: parseInt(reviewFormData.stele), comentariu: reviewFormData.comentariu })
        .eq('id', currentReviewId);
      
      if (error) throw error;
      
      setEditReviewMode(false);
      fetchRecenzii();
      if(showNotification) showNotification("Recenzie modificată!");
    } catch (err) {
      if(showNotification) showNotification("Eroare la editare!", "error");
    } finally { setLoading(false); }
  }

  async function handleDeleteRecenzie(id) {
    if(confirm('Ești sigur că vrei să ștergi această recenzie?')) {
      const { error } = await supabase.from('recenzii').delete().eq('id', id);
      if (!error) {
        setRecenzii(recenzii.filter(r => r.id !== id));
        if(showNotification) showNotification("Recenzie eliminată!");
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 animate-fade-in space-y-20">
      <div className="flex items-center gap-4 mb-16">
        <div className="bg-slate-950 p-4 rounded-3xl text-white shadow-2xl"><Package size={32} /></div>
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 uppercase">ECOPET <span className="text-emerald-500">Universe</span></h1>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] ml-1 mt-1">Gestiune Stoc și Produse</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100">
            <h2 className="text-2xl font-black italic mb-10 flex items-center gap-3">
              {editMode ? <Edit3 className="text-orange-500" /> : <Plus className="text-emerald-500" />}
              {editMode ? 'Editare Produs' : 'Adăugare'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nume Produs</label>
                <input required value={formData.nume} onChange={e => setFormData({...formData, nume: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Preț (RON)</label>
                  <input required type="number" step="0.01" value={formData.pret} onChange={e => setFormData({...formData, pret: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Stoc</label>
                  <input required type="number" value={formData.stoc} onChange={e => setFormData({...formData, stoc: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Categorie</label>
                <select value={formData.categorie_id} onChange={e => setFormData({...formData, categorie_id: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-sm outline-none">
                  <option value="1">Hrană</option>
                  <option value="2">Accesorii</option>
                  <option value="3">Îngrijire</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Imagine</label>
                <div className="relative h-40 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex items-center justify-center overflow-hidden">
                  {formData.imagine_url ? <img src={formData.imagine_url} className="w-full h-full object-cover" /> : <Upload className="text-slate-300" />}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <button disabled={loading || uploading} className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 ${editMode ? 'bg-orange-500 text-white' : 'bg-green-600 text-white'}`}>
                {loading ? <Loader2 className="animate-spin" /> : <Check size={18}/>} {editMode ? 'Actualizează' : 'Adaugă'}
              </button>
            </form>
          </div>
        </div>

        
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-black italic mb-6 flex items-center gap-3 uppercase tracking-tighter"><Box className="text-emerald-500"/> Catalog Produse</h2>
          {produse.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm flex items-center gap-6 border border-slate-100 hover:shadow-xl transition-all">
              <img src={p.imagine_url} className="w-24 h-24 rounded-3xl object-cover border border-slate-200" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md tracking-tighter">ID: #{p.id.slice(0,8)}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${p.stoc <= 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-500'}`}>Stoc: {p.stoc}</span>
                </div>
                <h3 className="font-black italic text-lg text-slate-900 leading-none mb-2">{p.nume}</h3>
                <p className="text-green-600 font-black text-sm">{p.pret} RON</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditMode(true); setCurrentId(p.id); setFormData({ nume: p.nume, pret: p.pret, categorie_id: String(p.categorie_id), imagine_url: p.imagine_url, descriere: p.descriere, stoc: String(p.stoc) }); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-4 bg-orange-50 text-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white transition-all"><Edit3 size={18}/></button>
                <button onClick={async () => { if(confirm('Elimini produsul?')) { await supabase.from('produs').delete().eq('id', p.id); fetchProduse(); if(showNotification) showNotification("Produs eliminat!"); } }} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-20 border-t border-slate-100 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-slate-950 p-4 rounded-3xl text-white"><MessageSquare size={24} /></div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Gestionare <span className="text-emerald-500">Recenzii</span></h2>
          </div>
        </div>

        {editReviewMode && (
          <div className="bg-orange-50 border-2 border-orange-200 p-8 rounded-[3rem] animate-fade-in shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black uppercase text-orange-700 italic flex items-center gap-2"><Edit3 size={20}/> Editează Recenzia #{currentReviewId?.slice(0,5)}</h3>
              <button onClick={() => setEditReviewMode(false)} className="text-orange-900 hover:scale-110 transition-all"><X size={24}/></button>
            </div>
            <form onSubmit={handleUpdateRecenzie} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-400 ml-4">Rating (1-5)</label>
                <input type="number" min="1" max="5" value={reviewFormData.stele} onChange={e => setReviewFormData({...reviewFormData, stele: e.target.value})} className="w-full p-4 bg-white rounded-2xl font-bold outline-none border-2 border-orange-100 focus:border-orange-500" />
              </div>
              <div className="md:col-span-8 space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-400 ml-4">Comentariu</label>
                <input value={reviewFormData.comentariu} onChange={e => setReviewFormData({...reviewFormData, comentariu: e.target.value})} className="w-full p-4 bg-white rounded-2xl font-bold outline-none border-2 border-orange-100 focus:border-orange-500" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg">
                  <Save size={16}/> Salvează
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recenzii.length > 0 ? recenzii.map((r) => (
            <div key={r.id} className={`bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${currentReviewId === r.id && editReviewMode ? 'ring-4 ring-orange-500' : ''}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < r.stele ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditRecenzie(r)}
                      className="p-3 bg-orange-50 text-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteRecenzie(r.id)}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-800 font-medium italic mb-6 leading-relaxed">"{r.comentariu}"</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Autor</p>
                  <p className="text-[12px] font-bold text-slate-900">{r.profile?.prenume} {r.profile?.nume}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400">Produs</p>
                  <p className="text-[11px] font-black text-emerald-600 uppercase italic tracking-tighter">{r.produs?.nume}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-black uppercase tracking-widest italic">Nu există recenzii de gestionat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}