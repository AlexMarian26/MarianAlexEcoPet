import { ShoppingCart, Heart, User, Settings, Leaf, LogOut, Sparkles, Search } from 'lucide-react';
import { supabase } from '../supabase';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ cartCount, wishlistCount, user, userRole, userPoints, searchTerm, setSearchTerm }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname; 

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        
        
        <Link to="/" className="flex items-center gap-2 cursor-pointer group shrink-0">
          <div className="bg-green-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-all shadow-lg shadow-green-200">
            <Leaf className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase flex items-baseline">
            EcoPet <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 font-serif italic lowercase ml-1 normal-case tracking-normal text-2xl">universe</span>
          </span>
        </Link>

        
        <div className="hidden lg:flex relative flex-1 max-w-md mx-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Caută în univers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
          />
        </div>

        
        <div className="hidden md:flex items-center gap-8 shrink-0">
          <Link 
            to="/" 
            className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${(path === '/' || path.startsWith('/produs')) ? 'text-green-600 underline underline-offset-8' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Magazin
          </Link>

          <Link 
            to="/despre" 
            className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${path === '/despre' ? 'text-green-600 underline underline-offset-8' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Despre Noi
          </Link>

          <Link 
            to="/contact" 
            className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${path === '/contact' ? 'text-green-600 underline underline-offset-8' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Contact
          </Link>
        </div>

        
        <div className="flex items-center gap-2 shrink-0">
          
          {user && (
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 mr-2">
              <Sparkles size={14} className="text-amber-500 fill-amber-500" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">Eco-Paws</span>
                <span className="text-xs font-black text-amber-900">{userPoints}</span>
              </div>
            </div>
          )}

          <Link to="/wishlist" className="relative p-3 hover:bg-slate-50 rounded-2xl text-slate-600">
            <Heart size={20} className={wishlistCount > 0 ? "fill-red-500 text-red-500" : ""} />
            {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{wishlistCount}</span>}
          </Link>

          <Link to="/cos" className="relative p-3 hover:bg-slate-50 rounded-2xl text-slate-600">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
          </Link>

          <div className="w-[1px] h-6 bg-slate-100 mx-3"></div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profil" className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-green-600 transition-all">
                <User size={18}/>
              </Link>
              
              {userRole === 'admin' && (
                <Link 
                  to="/admin" 
                  className="p-3 bg-orange-50 text-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-md"
                  title="Admin Panel"
                >
                  <Settings size={18} className="animate-spin-slow" />
                </Link>
              )}
              
              <button onClick={handleLogout} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <LogOut size={18}/>
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-green-600 transition-all shadow-xl inline-block">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}