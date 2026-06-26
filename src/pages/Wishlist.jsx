import { Trash2, ShoppingCart, HeartOff, Heart } from 'lucide-react';

export default function Wishlist({ wishlist, toggleWishlist, handleAddToCart }) {
  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <HeartOff size={64} className="mb-4 opacity-10" />
        <h2 className="text-xl font-bold italic text-slate-300 uppercase tracking-widest">Lista ta de dorințe este goală</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-black italic text-slate-800 mb-10 flex items-center gap-4">
        Favorite <Heart className="fill-red-500 text-red-500" />
      </h1>

      <div className="grid gap-6">
        {wishlist.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-all">
            <img src={p.imagine_url} alt={p.nume} className="w-32 h-32 object-cover rounded-[1.5rem]" />
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-xl text-slate-800 italic">{p.nume}</h3>
              <p className="text-green-600 font-black text-lg">{p.pret} RON</p>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-2">
                {p.stoc > 0 ? `În stoc: ${p.stoc} buc` : 'Stoc epuizat'}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleAddToCart(p)}
                disabled={p.stoc <= 0}
                className="bg-slate-900 text-white px-6 py-4 rounded-2xl hover:bg-green-600 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest disabled:opacity-20"
              >
                <ShoppingCart size={16} /> Pune în Coș
              </button>
              <button 
                onClick={() => toggleWishlist(p)}
                className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}