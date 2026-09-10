import { useState } from 'react';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, Gamepad2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { showToast } from '../components/ToastContainer';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
      if (/\d/.test(value)) strength++;
      if (/[^a-zA-Z\d]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      showToast('Please complete all fields', 'warning'); return;
    }
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters long', 'warning'); return;
    }
    setIsLoading(true);
    try {
      await axiosInstance.post('/api/auth/register', formData);
      showToast('Registration successful! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally { setIsLoading(false); }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSubmit(); };
  const getPasswordStrengthColor = () => ['bg-gray-200','bg-red-500','bg-orange-500','bg-yellow-500','bg-green-500'][passwordStrength];
  const getPasswordStrengthText = () => ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)',
            backgroundSize: '60px 60px',
          }}
        ></div>
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-3 mb-4"><div className="w-16 h-16 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg shadow-red-500/40"><Gamepad2 className="w-8 h-8 text-white" /></div><div className="text-left"><h1 className="text-3xl font-black tracking-tighter text-white italic leading-none">SYNNEX<span className="text-red-400">STORE</span></h1><p className="text-[10px] font-bold text-gray-400 tracking-[0.25em]">GAME STORE</p></div></div></div>
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border-2 border-red-500/20">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors" aria-label="Back to home">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-center"><div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full mb-4 shadow-lg"><UserPlus className="w-8 h-8 text-white" /></div><h2 className="text-3xl font-bold text-gray-800">Create Account</h2><p className="text-gray-500 mt-2">Create your account to get started</p></div>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Username</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div><input type="text" name="username" value={formData.username} onChange={handleChange} onKeyPress={handleKeyPress} placeholder="username" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div><input type="email" name="email" value={formData.email} onChange={handleChange} onKeyPress={handleKeyPress} placeholder="your@email.com" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div><input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onKeyPress={handleKeyPress} placeholder="••••••••" required className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}</button></div>{formData.password && <div className="mt-2"><div className="flex gap-1 mb-1">{[1,2,3,4].map(level => <div key={level} className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'}`} />)}</div><p className="text-xs text-gray-600">Password strength: <span className="font-medium">{getPasswordStrengthText()}</span></p></div>}</div>
            <button type="button" onClick={handleSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30">{isLoading ? <span className="flex items-center justify-center">Creating account...</span> : 'Create Account'}</button>
          </div>
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or</span></div></div>
          <p className="text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold">Sign In</Link></p>
        </div>
        <p className="text-center text-white/80 text-sm mt-6">© 2025 Synnex Store. All rights reserved.</p>
      </div>
    </div>
  );
}
export default Register;
