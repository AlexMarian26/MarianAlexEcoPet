import { Mail, Phone, MapPin, RotateCcw, Sparkles, Leaf } from 'lucide-react';

export default function Contact() {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 pb-20">
      
    
      <div className="flex flex-col items-center text-center space-y-6 pb-16 border-b border-slate-100 mb-20">
        <div className="bg-slate-900 p-5 rounded-3xl text-white shadow-xl">
          <Leaf size={32} />
        </div>
        <div className="space-y-3">
          <h1 className="text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-none">
            Contact <span className="text-green-600">Universe</span>
          </h1>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">
            Asistență Premium pentru Clienții ECOPET
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
              Canale de <span className="text-green-600">Comunicare</span>
            </h2>
            <p className="text-slate-500 text-lg italic font-medium leading-relaxed">
              Vă stăm la dispoziție pentru orice solicitare privind produsele noastre sustenabile sau stadiul comenzilor dumneavoastră.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <div className="bg-green-50 p-4 rounded-2xl text-green-600"><Mail size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Email Oficial</p>
                <p className="text-lg font-bold text-slate-900">contact@ecopet-universe.ro</p>
              </div>
            </div>

          
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <div className="bg-green-50 p-4 rounded-2xl text-green-600"><Phone size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Linie Telefonică</p>
                <p className="text-lg font-bold text-slate-900">+40 700 000 000</p>
              </div>
            </div>

           
            <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <div className="bg-green-50 p-4 rounded-2xl text-green-600"><MapPin size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Sediu Central</p>
                <p className="text-lg font-bold text-slate-900">București, România</p>
              </div>
            </div>
          </div>
        </div>

       
        <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 text-white/5 group-hover:text-green-500/10 transition-colors duration-700">
            <RotateCcw size={200} />
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500">
              <RotateCcw size={12}/> Serviciul Clienți
            </div>

            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              Procedură de <br /> <span className="text-green-500">returnare</span>
            </h3>

            <div className="space-y-6 pt-4">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm">
                <p className="text-xl italic text-slate-300 leading-relaxed">
                  "Angajamentul nostru față de sustenabilitate presupune transparență și eficiență în gestionarea retururilor."
                </p>
              </div>

              <div className="flex gap-4 items-start pt-6">
                <div className="bg-green-600 p-3 rounded-xl shadow-lg shadow-green-600/20 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-white mb-2">Protocol de Retur</p>
                  <p className="text-slate-400 text-lg italic leading-snug">
                    Instrucțiunile complete privind modalitatea de returnare a produselor sunt prevăzute pe <span className="text-white font-bold underline decoration-green-500 underline-offset-4">verso-ul documentelor</span> de însoțire a coletului.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}