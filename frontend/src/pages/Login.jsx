import { useState } from 'react';
import { Mail, Lock, LogIn, Gamepad2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { showToast } from '../components/ToastContainer';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      showToast('Login successful! 🎉', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally { setIsLoading(false); }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <button onClick={() => navigate(-1)} className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 rounded-lg bg-black/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/50" aria-label="Go back">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)', backgroundSize: '60px 60px' }} /></div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-3 mb-4"><div className="w-16 h-16 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg shadow-red-500/40"><Gamepad2 className="w-8 h-8 text-white" /></div><div className="text-left"><h1 className="text-3xl font-black tracking-tighter text-white italic leading-none">SYNNEX<span className="text-red-400">STORE</span></h1><p className="text-[10px] font-bold text-gray-400 tracking-[0.25em]">GAME STORE</p></div></div></div>
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border-2 border-red-500/20">
          <div className="text-center"><div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full mb-4 shadow-lg"><LogIn className="w-8 h-8 text-white" /></div><h2 className="text-3xl font-bold text-gray-800">Sign In</h2><p className="text-gray-500 mt-2">Welcome back!</p></div>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div><input type="email" name="email" value={formData.email} onChange={handleChange} onKeyPress={handleKeyPress} placeholder="your@email.com" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div><input type="password" name="password" value={formData.password} onChange={handleChange} onKeyPress={handleKeyPress} placeholder="••••••••" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200" /></div></div>
            <div className="flex items-center justify-between text-sm"><label className="flex items-center"><input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-gray-600">Remember me</span></label><a href="#" className="text-red-600 hover:text-red-700 font-medium">Forgot password?</a></div>
            <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30">{isLoading ? <span className="flex items-center justify-center">Signing in...</span> : 'Sign In'}</button>
          </div>
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or</span></div></div>
          <p className="text-center text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-red-600 hover:text-red-700 font-semibold">Create an account</Link></p>
        </div>
        <p className="text-center text-white/80 text-sm mt-6">Copyright © 2025 SYNNEX. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Login;
