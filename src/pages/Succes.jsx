import React from 'react';
import { CheckCircle } from 'lucide-react';

const Succes = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
      <CheckCircle className="text-green-500 w-20 h-20 mb-6" />
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Plată Reușită!</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Comanda ta a fost procesată. Îți mulțumim că alegi produsele ECOPET pentru prietenul tău necuvântător!
      </p>
      <button 
        onClick={() => setView('produse')}
        className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
      >
        Înapoi la Magazin
      </button>
    </div>
  );
};

export default Succes;