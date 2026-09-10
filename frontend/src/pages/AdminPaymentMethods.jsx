import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { ArrowLeft, Pencil, Plus, Save, Trash2, X } from 'lucide-react';

const emptyForm = {
  name: '', type: 'bank', account_name: '', account_number: '', qr_image_url: '', instructions: '', is_active: true, sort_order: 0,
};

export default function AdminPaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/payment-methods');
      setMethods(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) await axiosInstance.put(`/api/payment-methods/${editingId}`, form);
      else await axiosInstance.post('/api/payment-methods', form);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save payment method');
    } finally {
      setSaving(false);
    }
  };

  const edit = (method) => {
    setEditingId(method.payment_method_id);
    setForm({ ...emptyForm, ...method });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this payment method?')) return;
    try {
      await axiosInstance.delete(`/api/payment-methods/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete payment method');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mb-2"><ArrowLeft className="w-4 h-4" /> Admin dashboard</Link>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Payment methods</h1>
            <p className="text-gray-500 mt-1">Add, edit, activate or disable the methods customers can use for top-ups.</p>
          </div>
        </div>

        {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">{error}</div>}

        <form onSubmit={submit} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit payment method' : 'Add payment method'}</h2>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="text-gray-500"><X /></button>}
          </div>
          {[
            ['name', 'Display name'], ['type', 'Type'], ['account_name', 'Account name'], ['account_number', 'Account / phone number'], ['qr_image_url', 'QR image URL'],
          ].map(([key, label]) => (
            <label key={key} className="space-y-1">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
              <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full rounded-xl border px-3 py-2" />
            </label>
          ))}
          <label className="md:col-span-2 space-y-1">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Instructions</span>
            <textarea rows="3" value={form.instructions || ''} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="w-full rounded-xl border px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          <label className="space-y-1"><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sort order</span><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full rounded-xl border px-3 py-2" /></label>
          <button disabled={saving} className="md:col-span-2 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl px-4 py-3"><Save className="w-4 h-4" /> {saving ? 'Saving…' : editingId ? 'Update method' : 'Add method'}</button>
        </form>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden">
          <div className="p-5 border-b dark:border-gray-800"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Configured methods</h2></div>
          {loading ? <div className="p-8 text-center text-gray-500">Loading…</div> : methods.length === 0 ? <div className="p-8 text-center text-gray-500">No payment methods configured yet.</div> : (
            <div className="divide-y dark:divide-gray-800">
              {methods.map((method) => (
                <div key={method.payment_method_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div><div className="font-bold text-gray-900 dark:text-white">{method.name} <span className="text-xs font-normal px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{method.type}</span></div><div className="text-sm text-gray-500">{method.account_name || '—'} · {method.account_number || '—'}</div><div className="text-xs mt-1">{method.is_active ? 'Active' : 'Disabled'}</div></div>
                  <div className="flex gap-2"><button onClick={() => edit(method)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border"><Pencil className="w-4 h-4" /> Edit</button><button onClick={() => remove(method.payment_method_id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700"><Trash2 className="w-4 h-4" /> Delete</button></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
