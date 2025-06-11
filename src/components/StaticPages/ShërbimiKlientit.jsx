import React from 'react';

const contactMethods = [
  {
    title: 'Email',
    value: 'info@dyqani.com',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
    link: 'mailto:info@dyqani.com',
  },
  {
    title: 'Telefon',
    value: '+383 44 112 233',
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    ),
    link: 'tel:+38344112233',
  },
  {
    title: 'Chat Online',
    value: 'Butoni në këndin e poshtëm të djathtë',
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0 4.97 4.813 9 10.75 9 .98 0 1.94-.09 2.86-.26.41-.07.82.06 1.11.36l2.13 2.13a.75.75 0 001.28-.53v-2.36c0-.38.21-.73.55-.91C21.07 17.7 21.75 14.97 21.75 12c0-4.97-4.813-9-10.75-9S2.25 7.03 2.25 12z" /></svg>
    ),
    link: null,
  },
];

const ShërbimiKlientit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-4 rounded-full shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 10c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z" /></svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Shërbimi i Klientit</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {contactMethods.map((method, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
              {method.icon}
              <div className="text-lg font-semibold text-gray-800">{method.title}</div>
              {method.link ? (
                <a href={method.link} className="text-blue-600 underline">{method.value}</a>
              ) : (
                <span className="text-gray-600">{method.value}</span>
              )}
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Orari i Shërbimit</h2>
          <ul className="list-disc ml-6 mb-4 text-gray-700">
            <li>E hënë - E premte: 09:00 - 18:00</li>
            <li>E shtunë: 10:00 - 16:00</li>
            <li>E diel: Pushim</li>
          </ul>
          <h2 className="text-2xl font-bold mb-4 text-blue-700 mt-8">Pse të na kontaktoni?</h2>
          <ul className="list-disc ml-6 mb-4 text-gray-700">
            <li>Për informacione rreth porosive dhe dërgesave</li>
            <li>Për ndihmë me kthimin ose ndërrimin e produkteve</li>
            <li>Për të raportuar probleme teknike ose ankesë</li>
            <li>Për sugjerime dhe komente mbi shërbimin tonë</li>
          </ul>
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">Ne vlerësojmë çdo klient dhe jemi të përkushtuar të ofrojmë ndihmë të shpejtë dhe të saktë për çdo nevojë tuajën!</div>
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

export default ShërbimiKlientit; 