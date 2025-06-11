import React from 'react';

const faqs = [
  {
    question: 'Si mund të bëj një porosi?',
    answer:
      'Për të bërë një porosi, shtoni produktet në shportë dhe ndiqni hapat për të përfunduar blerjen.',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" /></svg>
    ),
  },
  {
    question: 'Sa kohë zgjat dërgesa?',
    answer:
      'Dërgesat zakonisht zgjasin 1-3 ditë pune brenda Kosovës. Për dërgesa jashtë vendit, koha mund të ndryshojë në varësi të destinacionit.',
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17a4 4 0 01-8 0m8 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a4 4 0 008 0zm0 0a4 4 0 01-8 0" /></svg>
    ),
  },
  {
    question: 'Si mund të paguaj?',
    answer:
      'Ne pranojmë pagesa pagesa në dorëzim (cash on delivery).',
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
    ),
  },
  {
    question: 'Si mund të kthej një produkt?',
    answer:
      'Mund të lexoni Politikën e Kthimit për të mësuar më shumë rreth procesit të kthimit.',
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7v4a2 2 0 01-2 2H7a2 2 0 01-2-2V7m5 4V7m4 4V7" /></svg>
    ),
  },
  {
    question: 'Si mund të kontaktoj shërbimin e klientit?',
    answer:
      'Na kontaktoni përmes emailit, telefonit ose chat-it online. Të gjitha detajet i gjeni te Shërbimi i Klientit.',
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
    ),
  },
];

const PyetjetShpeshta = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-4 rounded-full shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Pyetjet e Shpeshta</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-2">{faq.icon}<span className="text-lg font-semibold text-gray-800">{faq.question}</span></div>
              <div className="text-gray-600">{faq.answer}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">Nuk e gjetët përgjigjen? <a href="/sherbimi-klientit" className="text-blue-600 underline font-medium">Na kontaktoni</a>.</div>
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

export default PyetjetShpeshta; 