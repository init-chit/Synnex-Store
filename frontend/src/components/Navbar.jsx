import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { 
  Gamepad2, Search, Gift, CreditCard, Box, User, LogOut, ShieldAlert, 
  Bell, ShoppingCart, Menu, X, Heart, TrendingUp, Filter, 
  ChevronDown, Settings, Package, History, GitCompare
} from 'lucide-react';
import { showToast } from './ToastContainer';
import { smallPlaceholder } from '../utils/imagePlaceholder';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        fetchUserData();
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axiosInstance.get('/api/wallet/me');
      setBalance(res.data.wallet_balance || 0);
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };

  const performSearch = async (query) => {
    if (!query || query.trim().length < 1) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const res = await axiosInstance.get('/api/games');
      const games = Array.isArray(res.data) ? res.data : (res.data?.games || []);
      
      if (!games || games.length === 0) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      const searchLower = query.toLowerCase().trim();
      const filtered = games.filter(game => {
        if (!game || !game.name) return false;
        return (
          game.name.toLowerCase().includes(searchLower) ||
          (game.platform && game.platform.toLowerCase().includes(searchLower)) ||
          (game.description && game.description.toLowerCase().includes(searchLower))
        );
      }).slice(0, 5);
      
      setSearchResults(filtered);
      setShowSearchResults(filtered.length > 0);
    } catch (err) {
      console.error('Search failed', err);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search query changes
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
      }, 300); // Debounce 300ms
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    showToast('ออกจากระบบสำเร็จ', 'success');
  };

  const handleDailyReward = async () => {
    try {
      const res = await axiosInstance.post('/api/wallet/daily', {});
      showToast(res.data.message, 'success');
      fetchUserData();
    } catch (err) {
      showToast(err.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">🎮 ติดต่อเรา | Facebook Fanpage</span>
            <span className="text-red-200">24/hr Services</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden md:inline">ยินดีต้อนรับ, <span className="font-bold">{user.username}</span></span>
                <button onClick={handleLogout} className="hover:text-red-200 transition text-xs">
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="hover:text-red-200 transition text-xs">
                  เข้าสู่ระบบ
                </button>
                <span>|</span>
                <button onClick={() => navigate('/register')} className="hover:text-red-200 transition text-xs">
                  สมัครสมาชิก
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/40 transform group-hover:rotate-12 transition duration-300">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tighter text-gray-900 italic leading-none">
                  SYNNEX
                </h1>
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.25em] group-hover:text-red-600 transition">
                  GAME STORE CENTER
                </p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาเกม, แพลตฟอร์ม..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    if (value.trim().length > 0) {
                      performSearch(value);
                    } else {
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchQuery && searchQuery.trim().length > 0) {
                      performSearch(searchQuery);
                    }
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full border-2 border-transparent focus:border-red-500 focus:outline-none text-gray-900 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-red-200 max-h-96 overflow-y-auto z-50">
                    {searchResults.map((game) => (
                      <div
                        key={game.game_id}
                        onClick={() => {
                          navigate(`/games/${game.game_id}`);
                          setSearchQuery('');
                          setShowSearchResults(false);
                        }}
                        className="flex items-center gap-3 p-4 hover:bg-red-50 cursor-pointer transition border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={game.image_url}
                          alt={game.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => { e.target.src = smallPlaceholder; }}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{game.name}</h4>
                          <p className="text-sm text-gray-500">{game.platform}</p>
                          <p className="text-red-600 font-bold">฿{Number(game.price || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              
              {/* Notifications */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition relative"
                    title="การแจ้งเตือน"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Shopping Cart */}
              {user && (
                <button
                  onClick={() => navigate('/inventory')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition relative"
                  title="คลังของฉัน"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Balance */}
              {user && (
                <button
                  onClick={() => navigate('/topup')}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full hover:from-red-700 hover:to-red-800 transition shadow-lg font-bold text-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>฿{Number(balance).toLocaleString()}</span>
                </button>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-red-200 overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-bold text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Admin</span>
                        )}
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left"
                        >
                          <User className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">โปรไฟล์</span>
                        </button>
                        <button
                          onClick={() => { navigate('/orders'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left"
                        >
                          <History className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">ประวัติการสั่งซื้อ</span>
                        </button>
                        <button
                          onClick={() => { navigate('/inventory'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left"
                        >
                          <Package className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">คลังของฉัน</span>
                        </button>
                        <button
                          onClick={() => { navigate('/compare'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left"
                        >
                          <GitCompare className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">เปรียบเทียบเกม</span>
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => { navigate('/admin'); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left"
                          >
                            <ShieldAlert className="w-5 h-5 text-red-600" />
                            <span className="text-red-600 font-bold">Admin Panel</span>
                          </button>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left border-t border-gray-200 mt-2"
                        >
                          <LogOut className="w-5 h-5 text-red-600" />
                          <span className="text-red-600 font-bold">ออกจากระบบ</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition font-bold text-sm"
                >
                  เข้าสู่ระบบ
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center gap-1 pb-4">
            <NavLink icon={<TrendingUp size={18} />} label="หน้าหลัก" onClick={() => navigate('/')} />
            <NavLink icon={<CreditCard size={18} />} label="เติมเงิน" onClick={() => navigate('/topup')} />
            <NavLink icon={<Gift size={18} />} label="สุ่มของรางวัล" onClick={() => navigate('/gacha')} />
            <NavLink icon={<Box size={18} />} label="คลังของฉัน" onClick={() => navigate('/inventory')} />
            {user && <NavLink icon={<History size={18} />} label="ประวัติการสั่งซื้อ" onClick={() => navigate('/orders')} />}
            <NavLink icon={<GitCompare size={18} />} label="เปรียบเทียบเกม" onClick={() => navigate('/compare')} />
            <NavLink 
              icon={<Gift size={18} />} 
              label="รับฟรี" 
              onClick={handleDailyReward}
              highlight 
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <MobileNavLink icon={<TrendingUp />} label="หน้าหลัก" onClick={() => { navigate('/'); setMobileMenuOpen(false); }} />
              <MobileNavLink icon={<CreditCard />} label="เติมเงิน" onClick={() => { navigate('/topup'); setMobileMenuOpen(false); }} />
              <MobileNavLink icon={<Gift />} label="สุ่มของรางวัล" onClick={() => { navigate('/gacha'); setMobileMenuOpen(false); }} />
              <MobileNavLink icon={<Box />} label="คลังของฉัน" onClick={() => { navigate('/inventory'); setMobileMenuOpen(false); }} />
              {user && <MobileNavLink icon={<History />} label="ประวัติการสั่งซื้อ" onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }} />}
              <MobileNavLink icon={<GitCompare />} label="เปรียบเทียบเกม" onClick={() => { navigate('/compare'); setMobileMenuOpen(false); }} />
              <MobileNavLink icon={<Gift />} label="รับฟรี" onClick={() => { handleDailyReward(); setMobileMenuOpen(false); }} highlight />
            </div>
            
            {/* Mobile Search */}
            <div className="mt-4 px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาเกม..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    if (value.trim().length > 0) {
                      performSearch(value);
                    } else {
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-2 border-transparent focus:border-red-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

// NavLink Component
function NavLink({ icon, label, onClick, highlight = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
        highlight
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 animate-pulse'
          : 'text-gray-700 hover:bg-red-50'
      }`}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

// Mobile NavLink Component
function MobileNavLink({ icon, label, onClick, highlight = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        highlight
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
          : 'text-gray-700 hover:bg-red-50'
      }`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );
}

export default Navbar;

