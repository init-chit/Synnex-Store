import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import axiosInstance from '../utils/axios';
import { showToast } from '../components/ToastContainer';

export default function AdminTopUps() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/topups/pending');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load pending top-ups', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const review = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this top-up?`)) return;
    setBusy(id);
    try {
      await axiosInstance.post(`/api/admin/topups/${id}/review`, { action });
      showToast(action === 'approve' ? 'Top-up approved and wallet credited.' : 'Top-up rejected.', 'success');
      await load();
    } catch (error) {
      showToast(error.response?.data?.message || 'Review failed', 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mb-2"><ArrowLeft className="w-4 h-4" /> Admin dashboard</Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Top-up approvals</h1>
          <p className="text-gray-500 mt-1">Verify customer payment references before crediting wallet balances.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden">
          {loading ? <div className="p-8 text-center text-gray-500">Loading…</div> : items.length === 0 ? <div className="p-8 text-center text-gray-500">No pending top-ups.</div> : (
            <div className="divide-y dark:divide-gray-800">
              {items.map((item) => (
                <div key={item.topup_id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-1">
                    <div className="font-bold text-gray-900 dark:text-white">#{item.topup_id} · {Number(item.amount).toLocaleString()} MMK</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{item.username} · {item.email}</div>
                    <div className="text-sm text-gray-500">Method: {item.method}</div>
                    <div className="text-sm font-mono text-gray-700 dark:text-gray-200 break-all">Reference: {item.reference_id}</div>
                    <div className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button disabled={busy === item.topup_id} onClick={() => review(item.topup_id, 'approve')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-bold disabled:opacity-50"><Check className="w-4 h-4" /> Approve</button>
                    <button disabled={busy === item.topup_id} onClick={() => review(item.topup_id, 'reject')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-bold disabled:opacity-50"><X className="w-4 h-4" /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
