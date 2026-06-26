import { Leaf, Globe, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function Despre() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6 animate-fade-in">
      <div className="text-center mb-24">
        <h1 className="text-7xl font-black italic tracking-tighter text-slate-900 uppercase mb-4">
          Misiunea <span className="text-emerald-500">Universe</span>
        </h1>
        <p className="text-emerald-600 font-black uppercase text-[10px] tracking-[0.5em] mb-12">Sustenabilitate pentru prietenii noștri blănoși</p>
        <div className="max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed text-lg">
          Am pornit ECOPET dintr-o dorință simplă: să oferim animalelor de companie luxul pe care îl merită, fără a compromite viitorul planetei.
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: <Leaf size={32} />, title: "100% Bio", desc: "Toate materialele noastre sunt reciclate sau provin din surse bio-degradabile." },
          { icon: <Globe size={32} />, title: "Eco-Conștient", desc: "Reducem amprenta de carbon prin procese de producție verzi și ambalaje sustenabile." },
          { icon: <Heart size={32} />, title: "Iubire Pură", desc: "Fiecare produs este testat pentru siguranța și confortul maxim al animalelor." }
        ].map((val, i) => (
          <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
            <div className="bg-slate-950 text-emerald-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg">{val.icon}</div>
            <h3 className="text-2xl font-black italic text-slate-900 uppercase mb-4 tracking-tight">{val.title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{val.desc}</p>
          </div>
        ))}
      </div>

      
      <div className="mt-32 bg-slate-950 p-20 rounded-[4rem] text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
        <Sparkles className="text-emerald-500 mx-auto mb-8" size={48} />
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-6">Fiecare comandă salvează o părticică din Univers</h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-10 font-medium italic">Alătură-te comunității noastre și hai să facem lumea un loc mai bun, lăbuță cu lăbuță.</p>
      </div>
    </div>
  );
}