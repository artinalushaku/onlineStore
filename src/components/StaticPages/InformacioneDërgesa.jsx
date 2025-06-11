import React from 'react';

const shippingInfo = [
  {
    title: 'Kohëzgjatja e Dërgesës',
    description: 'Dërgesat brenda Kosovës realizohen brenda 1-3 ditëve pune. Për dërgesa ndërkombëtare, koha e dërgesës varet nga destinacioni dhe mund të zgjasë 5-10 ditë pune.',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
  },
  {
    title: 'Kostoja e Dërgesës',
    description: 'Dërgesa brenda Kosovës: 2€. Dërgesa falas për porosi mbi 50€. Dërgesa ndërkombëtare: çmimi varion sipas destinacionit.',
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" /></svg>
    ),
  },
  {
    title: 'Përcjellja e Porosisë',
    description: 'Pasi të dërgohet porosia juaj, do të merrni një email me numrin e përcjelljes (tracking number) dhe linkun për të ndjekur statusin e dërgesës.',
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-5a2 2 0 00-2-2h-1.5a1.5 1.5 0 01-1.5-1.5V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
  },
];

const InformacioneDërgesa = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-4 rounded-full shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Informacione për Dërgesën</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {shippingInfo.map((info, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
              {info.icon}
              <div className="text-lg font-semibold text-gray-800">{info.title}</div>
              <div className="text-gray-600 text-center">{info.description}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Pyetje të tjera?</h2>
          <p className="text-gray-700">Për çdo paqartësi, ju lutem kontaktoni <a href="/sherbimi-klientit" className="text-blue-600 underline">shërbimin e klientit</a> ose shikoni <a href="/pyetjet-e-shpeshta" className="text-blue-600 underline">Pyetjet e Shpeshta</a>.</p>
        </div>
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

export default InformacioneDërgesa; 