import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Leaf, Check, X } from 'lucide-react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Produse from './pages/Produse'
import DetaliiProdus from './pages/DetaliiProdus'
import Wishlist from './pages/Wishlist'
import Cos from './pages/Cos'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Profil from './pages/Profil'
import Succes from './pages/Succes'
import Despre from './pages/Despre'
import Contact from './pages/Contact'

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedAdminRoute = ({ user, userRole, children }) => {
  if (!user || userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedCheckoutRoute = ({ user, cart, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!cart || cart.length === 0) {
    return <Navigate to="/cos" replace />;
  }
  return children;
};

function App() {
  const [produse, setProduse] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState('produse');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Toate');
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('customer');
  const [userPoints, setUserPoints] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProduse();
    
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') === 'true') { 
      navigate('/succes');
      setCart([]); 
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSetView = (newView) => {
    setView(newView);
    if (newView === 'produse') navigate('/');
    else if (newView === 'detaliu') navigate(`/produs/${selectedProduct?.id || 'eco'}`);
    else navigate(`/${newView}`);
  };

  const showNotification = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProduse = async () => {
    const { data } = await supabase.from('produs').select('*').order('id', { ascending: false });
    if (data) setProduse(data);
    setLoading(false);
  };

  const checkRole = async (uid) => {
    if (!uid) return;
    const { data } = await supabase.from('profile').select('rol, puncte').eq('id', uid).single();
    if (data) {
      setUserRole(data.rol);
      setUserPoints(data.puncte || 0);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkRole(u.id);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkRole(u.id);
      else { setUserRole('customer'); setUserPoints(0); }
      setAuthLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleAddToCart = (p) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) {
        if (exists.quantity >= p.stoc) {
          showNotification(`Stoc limitat!`, 'error');
          return prev;
        }
        return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      showNotification(`${p.nume} adăugat!`);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amt) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amt;
        if (newQty > item.stoc) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const toggleWishlist = async (p) => {
    if (!user) { handleSetView('login'); return; }
    const exists = wishlist.some(item => item.id === p.id);
    if (exists) {
      await supabase.from('lista_dorinte').delete().eq('utilizator_id', user.id).eq('produs_id', p.id);
      setWishlist(prev => prev.filter(i => i.id !== p.id));
    } else {
      await supabase.from('lista_dorinte').insert([{ utilizator_id: user.id, produs_id: p.id }]);
      setWishlist(prev => [...prev, p]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-4 px-8 py-4 rounded-[2rem] shadow-2xl bg-slate-900 border border-green-500 text-white animate-bounce-in">
          <Check size={18} className="text-green-500" />
          <span className="font-black text-[11px] uppercase tracking-widest">{toast.text}</span>
        </div>
      )}

      <Navbar cartCount={cart.reduce((a, b) => a + b.quantity, 0)} wishlistCount={wishlist.length} setView={handleSetView} currentView={view} user={user} userRole={userRole} userPoints={userPoints} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="max-w-7xl mx-auto p-6 md:p-12 min-h-[70vh]">
        {(loading || authLoading) ? (
          <div className="flex flex-col items-center justify-center h-[50vh]"><Leaf className="text-green-600 w-12 h-12 mb-4 animate-bounce" /></div>
        ) : (
          <div className="animate-fade-in">
            <Routes>
              <Route path="/" element={<Produse filteredProduse={activeCategory === 'Toate' ? produse : produse.filter(p => String(p.categorie_id) === (activeCategory === 'Hrană' ? '1' : activeCategory === 'Accesorii' ? '2' : '3'))} wishlist={wishlist} toggleWishlist={toggleWishlist} handleAddToCart={handleAddToCart} activeCategory={activeCategory} setActiveCategory={setActiveCategory} openDetails={(p) => { setSelectedProduct(p); handleSetView('detaliu'); }} setView={handleSetView} searchTerm={searchTerm} />} />
              <Route path="/profil" element={<ProtectedRoute user={user}><Profil user={user} userRole={userRole} userPoints={userPoints} /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedCheckoutRoute user={user} cart={cart}><Checkout cart={cart} total={cart.reduce((a, b) => a + (b.pret * b.quantity), 0)} user={user} setView={handleSetView} clearCart={() => {setCart([]); fetchProduse();}} userPoints={userPoints} setUserPoints={setUserPoints} /></ProtectedCheckoutRoute>} />
              <Route path="/admin" element={<ProtectedAdminRoute user={user} userRole={userRole}><Admin onProductAdded={fetchProduse} showNotification={showNotification} /></ProtectedAdminRoute>} />
              <Route path="/cos" element={<Cos cart={cart} setView={handleSetView} updateQuantity={updateQuantity} />} />
              <Route path="/wishlist" element={<Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} handleAddToCart={handleAddToCart} />} />
              <Route path="/produs/:id" element={<DetaliiProdus produs={selectedProduct} wishlist={wishlist} toggleWishlist={toggleWishlist} handleAddToCart={handleAddToCart} goBack={() => handleSetView('produse')} user={user} userRole={userRole} />} />
              <Route path="/login" element={<Login setView={handleSetView} />} />
              <Route path="/register" element={<Register setView={handleSetView} />} />
              <Route path="/succes" element={<Succes setView={handleSetView} />} />
              <Route path="/despre" element={<Despre />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        )}
      </main>
      <footer className="py-20 text-center opacity-20 text-[9px] font-black uppercase tracking-[1em]">© 2026 ECOPET Universe</footer>
    </div>
  )
}
export default App