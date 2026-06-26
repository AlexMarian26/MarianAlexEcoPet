import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Leaf, ChevronDown, Sparkles } from 'lucide-react';

export default function Produse({ filteredProduse, wishlist, toggleWishlist, handleAddToCart, activeCategory, setActiveCategory, openDetails, searchTerm, setView }) {
  const [sortBy, setSortBy] = useState('implicit');
  const categorii = ['Toate', 'Hrană', 'Accesorii', 'Îngrijire'];

  const getSortedProduse = () => {
    let list = [...filteredProduse].filter(p => p.nume.toLowerCase().includes(searchTerm.toLowerCase()));
    switch (sortBy) {
      case 'alfabetic-az': return list.sort((a, b) => a.nume.localeCompare(b.nume));
      case 'alfabetic-za': return list.sort((a, b) => b.nume.localeCompare(a.nume));
      case 'pret-asc': return list.sort((a, b) => a.pret - b.pret);
      case 'pret-desc': return list.sort((a, b) => b.pret - a.pret);
      default: return list;
    }
  };

  const produseFinale = getSortedProduse();

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center text-center space-y-6 pb-12 border-b border-slate-100">
        <div className="bg-slate-900 p-5 rounded-3xl text-white shadow-xl">
          <Leaf size={32} />
        </div>
        <div className="space-y-3">
          <h1 className="text-7xl font-black italic text-slate-900 uppercase tracking-tighter leading-none">
            ECOPET <span className="text-green-600">Universe</span>
          </h1>
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">
            Excelență Sustenabilă și Grijă Naturală pentru Universul Lor
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categorii.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}>{cat}</button>
            ))}
          </div>
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white border border-slate-200 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-green-500 transition-all pr-14 shadow-sm">
              <option value="implicit">Sortare: Implicită</option>
              <option value="alfabetic-az">Alfabetic: A - Z</option>
              <option value="alfabetic-za">Alfabetic: Z - A</option>
              <option value="pret-asc">Preț: Mic - Mare</option>
              <option value="pret-desc">Preț: Mare - Mic</option>
            </select>
            <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {produseFinale.map(p => {
          const isFavorite = wishlist.some(fav => fav.id === p.id);
          return (
            <div key={p.id} className="group bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col relative">
              
             
              <button 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }} 
                className="absolute top-6 right-6 z-30 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg transition-all hover:scale-110 active:scale-75"
              >
                <Heart size={24} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-200'}`} />
              </button>

              <div className="relative aspect-square overflow-hidden cursor-pointer bg-slate-50" onClick={() => openDetails(p)}>
                {p.stoc === 0 && <div className="absolute top-6 left-6 z-20 bg-red-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Epuizat</div>}
                <img src={p.imagine_url} alt={p.nume} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              <div className="p-10 space-y-6 flex-1 flex flex-col">
                <h3 onClick={() => openDetails(p)} className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight cursor-pointer hover:text-green-600 transition-colors">{p.nume}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-900">{p.pret} <span className="text-sm font-normal text-slate-400">RON</span></span>
                  <button onClick={() => openDetails(p)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-green-600 transition-colors">Detalii</button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto pt-6">
                  <button 
                    onClick={() => handleAddToCart(p)} 
                    disabled={p.stoc === 0} 
                    className="bg-slate-100 text-slate-900 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-20"
                  >
                    <ShoppingCart size={18} /> Coș
                  </button>
                  <button 
                    onClick={() => { handleAddToCart(p); setView('checkout'); }} 
                    disabled={p.stoc === 0} 
                    className="bg-green-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-slate-900 shadow-xl transition-all active:scale-95 disabled:opacity-20"
                  >
                    Cumpără
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}