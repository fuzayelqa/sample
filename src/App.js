import React, { useState } from 'react';
import { 
  User, Shield, Utensils, Wallet, Calendar, ShoppingCart, 
  Bell, FileText, Star, AlertTriangle, Coffee, DollarSign, 
  Settings, LogOut, CheckCircle, XCircle, MessageSquare, Clipboard
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('dashboard');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const [mealRate, setMealRate] = useState(50);
  const [monthlyCharge, setMonthlyCharge] = useState(3000);
  const [lunchDeadline, setLunchDeadline] = useState("10:00");
  const [dinnerDeadline, setDinnerDeadline] = useState("19:00");

  const [members, setMembers] = useState([
    { id: 1, username: 'fahim', role: 'member', balance: 2600, status: 'active', room: '302', preference: 'Normal' },
    { id: 2, username: 'rahim', role: 'member', balance: 400, status: 'active', room: '101', preference: 'Less Spicy' },
    { id: 3, username: 'admin', role: 'admin', balance: 5000, status: 'active', room: 'Manager', preference: 'None' }
  ]);

  const [meals, setMeals] = useState({
    lunch: ['fahim'],
    dinner: ['fahim', 'rahim']
  });

  const [notices, setNotices] = useState([
    { id: 1, text: "আগামী শুক্রবার মেসের মিটিং হবে রাত ৯টায়। সবাইকে থাকার অনুরোধ রইলো।", date: "2026-05-20" }
  ]);

  const [bazarList, setBazarList] = useState([
    { id: 1, item: "রুই মাছ ও আলু", cost: 1200, date: "2026-05-20", buyer: "Fahim" }
  ]);

  const [payments, setPayments] = useState([
    { id: 1, username: 'rahim', amount: 2500, method: 'bKash', trxId: 'TRX998822', status: 'pending' }
  ]);

  const [complaints, setComplaints] = useState([
    { id: 1, username: 'rahim', issue: 'WiFi স্পীড অনেক কম', reply: '', status: 'Pending' }
  ]);

  const [menu] = useState({
    Sat: "ভাত + মুরগি + ডাল", Sun: "ভাত + মাছ + সবজি", Mon: "ভাত + ডিম + ভর্তা",
    Tue: "ভাত + গরুর মাংস + ডাল", Wed: "ভাত + মাছ + আলুভর্তা", Thu: "খিচুড়ি + ডিম", Fri: "পোলাও + মুরগির রোস্ট"
  });

  const [cleaning] = useState([
    { day: "শনিবার", name: "Fahim" }, { day: "রবিবার", name: "Rahim" }, { day: "সোমবার", name: "Karim" }
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = members.find(m => m.username.toLowerCase() === usernameInput.toLowerCase());
    if (foundUser && passwordInput === '1234') {
      if (foundUser.status === 'pending') {
        setError('আপনার অ্যাকাউন্ট এখনো এডমিন দ্বারা অনুমোদিত হয়নি!');
        return;
      }
      setUser(foundUser);
      setError('');
    } else if (usernameInput === 'admin' && passwordInput === 'admin123') {
      setUser({ username: 'admin', role: 'admin', balance: 99999 });
      setError('');
    } else {
      setError('ভুল ইউজারনেম অথবা পাসওয়ার্ড!');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!usernameInput) return;
    const exists = members.find(m => m.username === usernameInput);
    if (exists) {
      setError('এই ইউজারনেম অলরেডি আছে!');
      return;
    }
    const newMember = {
      id: Date.now(),
      username: usernameInput,
      role: 'member',
      balance: 0,
      status: 'pending',
      room: 'Not Assigned',
      preference: 'Normal'
    };
    setMembers([...members, newMember]);
    alert('রেজিস্ট্রেশন সফল! এডমিনের অনুমোদনের জন্য অপেক্ষা করুন।');
    setUsernameInput('');
    setPasswordInput('');
  };

  const toggleMeal = (type) => {
    if (user.balance < 2500) {
      alert("⚠️ মিল চালু করতে হলে কমপক্ষে ২৫০০ টাকা ডিপোজিট থাকতে হবে!");
      return;
    }
    const currentList = [...meals[type]];
    if (currentList.includes(user.username)) {
      setMeals({ ...meals, [type]: currentList.filter(u => u !== user.username) });
    } else {
      if (user.balance < mealRate) {
        alert("আপনার ব্যালেন্স শেষ! খাবার অন করা যাবে না।");
        return;
      }
      setUser({ ...user, balance: user.balance - mealRate });
      setMeals({ ...meals, [type]: [...currentList, user.username] });
    }
  };

  const [amt, setAmt] = useState('');
  const [method, setMethod] = useState('bKash');
  const [trx, setTrx] = useState('');
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPayments([...payments, { id: Date.now(), username: user.username, amount: Number(amt), method, trxId: trx, status: 'pending' }]);
    alert('পেমেন্ট রিকোয়েস্ট পাঠানো হয়েছে! এডমিন চেক করে ব্যালেন্স যোগ করে দেবে।');
    setAmt(''); setTrx('');
  };

  const approvePayment = (id) => {
    const pay = payments.find(p => p.id === id);
    setMembers(members.map(m => m.username === pay.username ? { ...m, balance: m.balance + pay.amount } : m));
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  const approveMember = (id) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: 'active' } : m));
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-blue-600">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">অনুক্ত মেস</h1>
            <p className="text-slate-500 mt-1 text-sm">স্মার্ট মেস ম্যানেজমেন্ট সিস্টেম 🍽️</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">ইউজারনেম</label>
              <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} required placeholder="যেমন: fahim" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">পাসওয়ার্ড (Default: 1234)</label>
              <input type="password" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm">লগইন করুন</button>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs">নতুন মেম্বার?</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button onClick={handleRegister} className="w-full bg-slate-100 text-blue-600 py-2 rounded-xl font-bold hover:bg-slate-200 transition text-sm">ফ্রি রেজিস্ট্রেশন রিকোয়েস্ট</button>
          <p className="text-center text-[10px] text-slate-400 mt-4">এডমিন লগইন: admin / admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="bg-blue-900 text-white w-full md:w-64 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-wide text-white">অনুক্ত মেস</h2>
            <p className="text-blue-300 text-xs font-medium">প্যানেল: {user.role === 'admin' ? 'এডমিন' : 'মেম্বার ('+user.username+')'}</p>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-blue-800 text-blue-100'}`}><Utensils size={18}/> ড্যাশবোর্ড ও মিল</button>
            <button onClick={() => setView('finance')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${view === 'finance' ? 'bg-blue-600 text-white' : 'hover:bg-blue-800 text-blue-100'}`}><Wallet size={18}/> টাকা-পয়সা ও পেমেন্ট</button>
            <button onClick={() => setView('bazar')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${view === 'bazar' ? 'bg-blue-600 text-white' : 'hover:bg-blue-800 text-blue-100'}`}><ShoppingCart size={18}/> বাজার খরচ ও মেনু</button>
            <button onClick={() => setView('mess')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${view === 'mess' ? 'bg-blue-600 text-white' : 'hover:bg-blue-800 text-blue-100'}`}><Clipboard size={18}/> মেস ম্যানেজমেন্ট</button>
            {user.role === 'admin' && (
              <button onClick={() => setView('admin')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${view === 'admin' ? 'bg-blue-600 text-white' : 'hover:bg-blue-800 text-blue-100'}`}><Shield size={18}/> এডমিন কন্ট্রোল</button>
            )}
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="mt-8 flex items-center gap-3 text-red-300 hover:text-red-400 font-bold text-sm bg-blue-950 p-3 rounded-xl"><LogOut size={16}/> লগআউট</button>
      </div>

      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {user.role !== 'admin' && user.balance < 500 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
            <AlertTriangle className="text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">লো ব্যালেন্স অ্যালার্ট!</p>
              <p className="text-xs">আপনার ব্যালেন্স ৫০০ টাকার নিচে আছে ({user.balance} টাকা)। মিল সচল রাখতে দ্রুত টাকা রিচার্জ করুন।</p>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">স্বাগতম, {user.username}! 👋</h1>
                <p className="text-slate-500 text-sm">আজকের মেস পরিস্থিতি ও মিল কন্ট্রোল প্যানেল।</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl shadow-sm border flex items-center gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">ব্যালেন্স</p>
                  <p className="text-xl font-black text-blue-600">৳{user.balance}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <div className="text-blue-500 font-bold text-xs uppercase mb-1">আজকের দুপুরের মিল</div>
                <div className="text-2xl font-extrabold text-slate-800">{meals.lunch.length} টি</div>
                <p className="text-xs text-slate-400 mt-1">ডেডলাইন: সকাল {lunchDeadline} টা</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <div className="text-blue-500 font-bold text-xs uppercase mb-1">আজকের রাতের মিল</div>
                <div className="text-2xl font-extrabold text-slate-800">{meals.dinner.length} টি</div>
                <p className="text-xs text-slate-400 mt-1">ডেডলাইন: সন্ধ্যা {dinnerDeadline} টা</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <div className="text-blue-500 font-bold text-xs uppercase mb-1">ফিক্সড মিল রেট</div>
                <div className="text-2xl font-extrabold text-slate-800">৳{mealRate}</div>
                <p className="text-xs text-slate-400 mt-1">অটো-কাট সিস্টেম</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <div className="text-blue-500 font-bold text-xs uppercase mb-1">মাসিক মেস চার্জ</div>
                <div className="text-2xl font-extrabold text-slate-800">৳{monthlyCharge}</div>
                <p className="text-xs text-slate-400 mt-1">এডমিন দ্বারা পরিবর্তনযোগ্য</p>
              </div>
            </div>

            {user.role !== 'admin' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2"><Coffee className="text-blue-600"/> আপনার মিল অন/অফ করুন</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-xl flex justify-between items-center bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-700">দুপুরের খাবার</p>
                      <p className="text-xs text-slate-400">স্ট্যাটাস: {meals.lunch.includes(user.username) ? <span className="text-green-600 font-bold">চালু আছে</span> : <span className="text-red-500 font-bold">বন্ধ</span>}</p>
                    </div>
                    <button onClick={() => toggleMeal('lunch')} className={`px-4 py-2 rounded-lg font-bold text-xs transition shadow-sm ${meals.lunch.includes(user.username) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                      {meals.lunch.includes(user.username) ? 'বন্ধ করুন' : 'চালু করুন'}
                    </button>
                  </div>
                  <div className="border p-4 rounded-xl flex justify-between items-center bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-700">রাতের খাবার</p>
                      <p className="text-xs text-slate-400">স্ট্যাটাস: {meals.dinner.includes(user.username) ? <span className="text-green-600 font-bold">চালু আছে</span> : <span className="text-red-500 font-bold">বন্ধ</span>}</p>
                    </div>
                    <button onClick={() => toggleMeal('dinner')} className={`px-4 py-2 rounded-lg font-bold text-xs transition shadow-sm ${meals.dinner.includes(user.username) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                      {meals.dinner.includes(user.username) ? 'বন্ধ করুন' : 'চালু করুন'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2"><Bell className="text-blue-600"/> মেস নোটিশ বোর্ড</h3>
              <div className="space-y-3">
                {notices.map(n => (
                  <div key={n.id} className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl">
                    <p className="text-sm text-slate-700 font-medium">{n.text}</p>
                    <span className="text-[10px] text-slate-400 block mt-2 font-bold">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'finance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Wallet className="text-blue-600"/> টাকা-পয়সা ও পেমেন্ট গেটওয়ে (ম্যানুয়াল)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {user.role !== 'admin' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h3 className="text-sm font-bold mb-4 text-slate-700">বিকাশ বা নগদ-এ টাকা জমা দিন</h3>
                  <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-900 mb-4 space-y-1">
                    <p>📱 <b>বিকাশ পার্সোনাল:</b> ০১৭XXXXXXXX</p>
                    <p>📱 <b>নগদ পার্সোনাল:</b> ০১৯XXXXXXXX</p>
                    <p className="text-red-600 font-bold mt-1">* টাকা পাঠানোর পর নিচের ফর্মটি পূরণ করুন।</p>
                  </div>
                  <form onSubmit={handlePaymentSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">টাকার পরিমাণ</label>
                      <input type="number" className="w-full px-4 py-2 border rounded-xl text-sm" value={amt} onChange={e => setAmt(e.target.value)} placeholder="যেমন: ২৫০০" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">পেমেন্ট মেথড</label>
                      <select className="w-full px-4 py-2 border rounded-xl text-sm" value={method} onChange={e => setMethod(e.target.value)}>
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Transaction ID (TrxID)</label>
                      <input type="text" className="w-full px-4 py-2 border rounded-xl text-sm" value={trx} onChange={e => setTrx(e.target.value)} placeholder="যেমন: AX776GD9" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition">পেমেন্ট সাবমিট করুন</button>
                  </form>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-sm border flex-1">
                <h3 className="text-sm font-bold mb-4 text-slate-700">আপনার লেনদেনের ইতিহাস</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase font-bold">
                        <th className="p-3">ইউজার</th>
                        <th className="p-3">পরিমাণ</th>
                        <th className="p-3">মেথড</th>
                        <th className="p-3">TrxID</th>
                        <th className="p-3">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {payments.map(p => (
                        <tr key={p.id}>
                          <td className="p-3 font-semibold">{p.username}</td>
                          <td className="p-3 font-bold text-blue-600">৳{p.amount}</td>
                          <td className="p-3">{p.method}</td>
                          <td className="p-3 font-mono">{p.trxId}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {p.status === 'approved' ? 'সফল' : 'পেন্ডিং'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'bazar' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ShoppingCart className="text-blue-600"/> বাজার খরচ ও সাপ্তাহিক খাবার মেনু</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-sm font-bold mb-4 text-slate-700">📋 এই সপ্তাহের খাবার মেনু</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(menu).map(([day, food]) => (
                    <div key={day} className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-blue-700">{day === 'Sat'?'শনিবার':day==='Sun'?'রবিবার':day==='Mon'?'সোমবার':day==='Tue'?'মঙ্গলবার':day==='Wed'?'বুধবার':day==='Thu'?'বৃহস্পতিবার':'শুক্রবার'}</span>
                      <span className="text-slate-600 font-medium">{food}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-sm font-bold mb-4 text-slate-700">💸 বাজারের খরচের হিসেব</h3>
                <div className="space-y-3">
                  {bazarList.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-3 border rounded-xl bg-slate-50">
                      <div>
                        <p className="font-bold text-sm text-slate-700">{b.item}</p>
                        <p className="text-[10px] text-slate-400">বাজারকারী: {b.buyer} | তারিখ: {b.date}</p>
                      </div>
                      <span className="font-extrabold text-sm text-blue-600">৳{b.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'mess' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Clipboard className="text-blue-600"/> মেস ম্যানেজমেন্ট ড্যাশবোর্ড</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-sm font-bold mb-3 text-slate-700">🧹 ক্লিনিং ও রুম ডিউটি শিডিউল</h3>
                <div className="divide-y text-sm">
                  {cleaning.map((c, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between">
                      <span className="font-bold text-slate-600">{c.day}</span>
                      <span className="text-blue-600 font-bold">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-sm font-bold mb-3 text-slate-700">🔧 কমপ্লেন বক্স (অভিযোগ জানান)</h3>
                <div className="space-y-4">
                  {user.role !== 'admin' && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const issueText = e.target.elements.issue.value;
                      if(!issueText) return;
                      setComplaints([...complaints, { id: Date.now(), username: user.username, issue: issueText, reply: '', status: 'Pending' }]);
                      e.target.reset();
                      alert('অভিযোগ জমা হয়েছে!');
                    }} className="flex gap-2">
                      <input name="issue" type="text" className="flex-1 px-3 py-1.5 border text-xs rounded-xl" placeholder="আপনার সমস্যাটি লিখুন..." required />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-bold text-xs">পাঠান</button>
                    </form>
                  )}
                  <div className="space-y-2 text-xs">
                    {complaints.map(c => (
                      <div key={c.id} className="p-3 bg-slate-50 border rounded-xl">
                        <p className="font-bold text-slate-700">মেম্বার: {c.username}</p>
                        <p className="text-slate-600 mt-0.5">অভিযোগ: {c.issue}</p>
                        {c.reply && <p className="text-blue-600 font-bold mt-1">↳ এডমিন রিপ্লাই: {c.reply}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'admin' && user.role === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2"><Shield size={24} /> সুপার এডমিন কন্ট্রোল প্যানেল</h2>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-sm font-bold mb-3 text-slate-700">💰 পেন্ডিং পেমেন্ট অ্যাপ্রুভাল</h3>
              <div className="space-y-3">
                {payments.filter(p => p.status === 'pending').length === 0 ? <p className="text-xs text-slate-400">কোন পেন্ডিং পেমেন্ট নেই।</p> : null}
                {payments.filter(p => p.status === 'pending').map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 border rounded-xl bg-slate-50">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{p.username} &rarr; <span className="text-blue-600">৳{p.amount}</span> ({p.method})</p>
                      <p className="text-xs font-mono text-slate-400">TrxID: {p.trxId}</p>
                    </div>
                    <button onClick={() => approvePayment(p.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition flex items-center gap-1"><CheckCircle size={14}/> অ্যাপ্রুভ</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-sm font-bold mb-3 text-slate-700">👥 মেস মেম্বার ও পেন্ডিং রেজিস্ট্রেশন লিস্ট</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-bold">
                      <th className="p-3">ইউজারনেম</th>
                      <th className="p-3">রুম নং</th>
                      <th className="p-3">ব্যালেন্স</th>
                      <th className="p-3">স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {members.map(m => (
                      <tr key={m.id}>
                        <td className="p-3 font-bold">{m.username}</td>
                        <td className="p-3">{m.room}</td>
                        <td className="p-3 font-bold text-blue-600">৳{m.balance}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {m.status === 'active' ? 'অ্যাক্টিভ' : 'পেন্ডিং রিকোয়েস্ট'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {m.status === 'pending' && (
                            <button onClick={() => approveMember(m.id)} className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-[10px]">অ্যাপ্রুভ</button>
                          )}
                          {m.username !== 'admin' && (
                            <button onClick={() => removeMember(m.id)} className="bg-red-500 text-white px-2 py-1 rounded font-bold text-[10px]">রিমুভ</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-sm font-bold mb-3 text-slate-700">⚙️ মেস কনফিগারেশন চেঞ্জ করুন</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">মিল রেট (৳)</label>
                  <input type="number" className="w-full p-2 border rounded-xl text-xs" value={mealRate} onChange={e => setMealRate(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">ফিক্সড মেস চার্জ (৳)</label>
                  <input type="number" className="w-full p-2 border rounded-xl text-xs" value={monthlyCharge} onChange={e => setMonthlyCharge(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">দুপুরের ডেডলাইন</label>
                  <input type="text" className="w-full p-2 border rounded-xl text-xs" value={lunchDeadline} onChange={e => setLunchDeadline(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">রাতের ডেডলাইন</label>
                  <input type="text" className="w-full p-2 border rounded-xl text-xs" value={dinnerDeadline} onChange={e => setDinnerDeadline(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}