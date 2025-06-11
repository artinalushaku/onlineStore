import React from 'react';

const returnPolicy = [
  {
    title: 'Kushtet për Kthim',
    description: 'Produkti duhet të jetë i papërdorur dhe në paketimin origjinal. Kërkesa për kthim duhet të bëhet brenda 14 ditëve nga data e pranimit të produktit. Produkti nuk duhet të jetë i dëmtuar ose i konsumuar.',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7v4a2 2 0 01-2 2H7a2 2 0 01-2-2V7m5 4V7m4 4V7" /></svg>
    ),
  },
  {
    title: 'Si të bëni një kthim?',
    description: "Na kontaktoni përmes emailit ose telefonit për të njoftuar për kthimin. Plotësoni formularin e kthimit që do t'ju dërgojmë me email. Dërgoni produktin në adresën tonë të specifikuar.",
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" /></svg>
    ),
  },
  {
    title: 'Rimbursimi',
    description: 'Pasi të pranojmë dhe verifikojmë produktin e kthyer, rimbursimi do të kryhet brenda 5 ditëve pune në mënyrën e pagesës që keni përdorur.',
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
    ),
  },
  {
    title: 'Përjashtime',
    description: 'Produkte të personalizuara ose të hapura nuk mund të kthehen, përveç nëse janë të dëmtuara ose me defekt nga prodhuesi.',
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    ),
  },
];

const PolitikaKthimit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-4 rounded-full shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7v4a2 2 0 01-2 2H7a2 2 0 01-2-2V7m5 4V7m4 4V7" /></svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Politika e Kthimit</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {returnPolicy.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
              {item.icon}
              <div className="text-lg font-semibold text-gray-800">{item.title}</div>
              <div className="text-gray-600 text-center">{item.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">Për çdo pyetje, ju lutem kontaktoni <a href="/sherbimi-klientit" className="text-blue-600 underline font-medium">shërbimin e klientit</a>.</div>
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

export default PolitikaKthimit; 