import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastContainer';

function TopUp() {
  const [balance, setBalance] = useState(0);
  const [methods, setMethods] = useState([]);
  const [method, setMethod] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [wallet, paymentMethods] = await Promise.all([
        axiosInstance.get('/api/wallet/me'),
        axiosInstance.get('/api/payment-methods'),
      ]);
      setBalance(wallet.data.wallet_balance);
      const active = Array.isArray(paymentMethods.data) ? paymentMethods.data.filter((item) => item.is_active) : [];
      setMethods(active);
      if (!method && active[0]) setMethod(active[0].name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTopUp = async (event) => {
    event.preventDefault();
    if (!method || !referenceId.trim()) {
      showToast('Select a payment method and enter the payment reference.', 'error');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/api/wallet/topup', { amount: Number(amount), method, reference_id: referenceId.trim() }, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Top-up submitted. Waiting for admin approval.', 'success');
      setReferenceId('');
      await fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Top-up submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row gap-5 justify-between md:items-center text-white">
          <div><h2 className="text-xl opacity-90 mb-2">Current Balance</h2><div className="text-3xl md:text-5xl font-bold flex items-center gap-2"><Wallet className="w-8 h-8 md:w-10 md:h-10" />{Number(balance).toLocaleString()} MMK</div></div>
          <button onClick={() => navigate('/')} className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full transition font-bold flex items-center gap-2 w-fit"><ArrowLeft size={18} /> Back to Home</button>
        </div>

        <form onSubmit={handleTopUp} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 md:p-7 space-y-5">
          <div><h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><CreditCard className="text-red-600" /> Top Up Wallet</h3><p className="text-gray-500 mt-1">Minimum top-up: 1,000 MMK. Admin approval is required before your balance changes.</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1000, 3000, 5000, 10000, 20000, 50000].map((value) => <button type="button" key={value} onClick={() => setAmount(value)} className={`rounded-xl p-4 border-2 font-bold transition ${amount === value ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 dark:border-gray-700'}`}>{value.toLocaleString()} MMK</button>)}
          </div>
          <label className="block space-y-2"><span className="font-semibold text-gray-700 dark:text-gray-200">Payment method</span><select value={method} onChange={(e) => setMethod(e.target.value)} required className="w-full rounded-xl border px-3 py-3 bg-white dark:bg-gray-800">{methods.length === 0 ? <option value="">No payment methods configured</option> : methods.map((item) => <option key={item.payment_method_id} value={item.name}>{item.name} — {item.account_number || item.type}</option>)}</select></label>
          {methods.length > 0 && <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 text-sm text-gray-600 dark:text-gray-300">{methods.find((item) => item.name === method)?.instructions || 'Complete the payment using the selected method, then enter your payment reference below.'}</div>}
          <label className="block space-y-2"><span className="font-semibold text-gray-700 dark:text-gray-200">Payment reference</span><input value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder="Transaction ID / transfer reference" required className="w-full rounded-xl border px-3 py-3 bg-white dark:bg-gray-800" /></label>
          <button type="submit" disabled={loading || methods.length === 0} className="w-full rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3">{loading ? 'Submitting…' : `Submit ${Number(amount).toLocaleString()} MMK Top-Up`}</button>
        </form>
      </div>
    </div>
  );
}
export default TopUp;
