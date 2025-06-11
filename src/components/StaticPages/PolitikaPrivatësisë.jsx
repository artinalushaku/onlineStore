import React from 'react';

const privacySections = [
  {
    title: 'Çfarë të dhënash mbledhim?',
    description: 'Emri dhe mbiemri, adresa e emailit dhe numri i telefonit, adresa e dërgesës, historiku i porosive.',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" /></svg>
    ),
  },
  {
    title: 'Si i përdorim të dhënat tuaja?',
    description: 'Për të përpunuar dhe dërguar porositë tuaja, për të përmirësuar shërbimet tona, për të komunikuar me ju rreth porosive ose ofertave.',
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
    ),
  },
  {
    title: 'A i ndajmë të dhënat me palë të treta?',
    description: 'Të dhënat tuaja nuk ndahen me palë të treta, përveç kur është e nevojshme për përpunimin e porosisë (p.sh. kompanitë e dërgesës) ose kur kërkohet me ligj.',
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    ),
  },
  {
    title: 'Të drejtat tuaja',
    description: 'Keni të drejtë të kërkoni qasje, korrigjim ose fshirje të të dhënave tuaja personale. Mund të tërhiqni pëlqimin për marketing në çdo kohë.',
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
  },
];

const PolitikaPrivatësisë = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-4 rounded-full shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" /></svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Politika e Privatësisë</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {privacySections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
              {section.icon}
              <div className="text-lg font-semibold text-gray-800">{section.title}</div>
              <div className="text-gray-600 text-center">{section.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">Për çdo pyetje ose kërkesë lidhur me privatësinë, ju lutem na kontaktoni në <a href="mailto:info@dyqani.com" className="text-blue-600 underline font-medium">info@dyqani.com</a>.</div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default PolitikaPrivatësisë; 