import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { ShoppingCart, Search, Gift, CreditCard, Box, User, LogOut, ShieldAlert, Gamepad2, X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastContainer';
import { GameCardSkeleton } from '../components/LoadingSkeleton';
import Navbar from '../components/Navbar';
import QuickFilters from '../components/QuickFilters';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import { smallPlaceholder } from '../utils/imagePlaceholder';

function Home() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const navigate = useNavigate();
  let user = null;
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (err) {
    console.error('Error parsing user:', err);
  } 

  useEffect(() => {
    fetchGames();
    fetchCategories();
    fetchRecentlyViewed();
    if (user) {
      fetchUserBalance();
      fetchWishlist();
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get('/api/wishlist');
      setWishlist(res.data.map(item => item.game_id));
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  };

  const toggleWishlist = async (gameId, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('กรุณาเข้าสู่ระบบก่อน', 'warning');
      navigate('/login');
      return;
    }

    try {
      const res = await axiosInstance.post(`/api/wishlist/toggle/${gameId}`);
      const isInWishlist = res.data.inWishlist;
      
      if (isInWishlist) {
        setWishlist([...wishlist, parseInt(gameId)]);
        showToast('เพิ่มในรายการโปรดแล้ว', 'success');
      } else {
        setWishlist(wishlist.filter(id => id !== parseInt(gameId)));
        showToast('ลบออกจากรายการโปรดแล้ว', 'info');
      }
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'เกิดข้อผิดพลาด';
      showToast(errorMsg, 'error');
    }
  };

  // ฟิลเตอร์เกมตาม search query และ filters
  useEffect(() => {
    if (!games || games.length === 0) {
      setFilteredGames([]);
      return;
    }

    let filtered = [...games];

    // Search filter
    if (searchQuery && searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(game => {
        if (!game || !game.name) return false;
        return (
          game.name.toLowerCase().includes(searchLower) ||
          (game.platform && game.platform.toLowerCase().includes(searchLower)) ||
          (game.description && game.description.toLowerCase().includes(searchLower))
        );
      });
    }

    // Applied filters
    if (appliedFilters) {
      // Platform filter
      if (appliedFilters.platform && appliedFilters.platform.length > 0) {
        filtered = filtered.filter(game => appliedFilters.platform.includes(game.platform));
      }

      // Price range filter
      if (appliedFilters.priceRange) {
        filtered = filtered.filter(game => {
          const price = parseFloat(game.price || 0);
          return price >= appliedFilters.priceRange.min && price <= appliedFilters.priceRange.max;
        });
      }

      // Sort
      if (appliedFilters.sortBy !== 'default') {
        switch (appliedFilters.sortBy) {
          case 'price-low':
            filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
            break;
          case 'price-high':
            filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
            break;
          case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'newest':
            filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            break;
        }
      }
    }

    setFilteredGames(filtered);
  }, [searchQuery, games, appliedFilters]);

  const handleFilterChange = (filters) => {
    setAppliedFilters(filters);
  };

  const fetchUserBalance = async () => {
    try {
      const res = await axiosInstance.get('/api/wallet/me');
      setBalance(res.data.wallet_balance || 0); 
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/api/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchRecentlyViewed = () => {
    try {
      const viewed = getRecentlyViewed();
      setRecentlyViewed(viewed.slice(0, 8));
    } catch (err) {
      console.error('Failed to fetch recently viewed', err);
      setRecentlyViewed([]);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axiosInstance.get('/api/recommendations', { headers });
      setRecommendations(res.data || []);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    }
  };

  const fetchGames = async () => {
    try {
      const res = await axiosInstance.get('/api/games');
      console.log('API Response:', res.data); // Debug log
      
      // รองรับทั้ง res.data.games และ res.data โดยตรง
      let gamesData = [];
      if (Array.isArray(res.data)) {
        gamesData = res.data;
      } else if (res.data && Array.isArray(res.data.games)) {
        gamesData = res.data.games;
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        gamesData = res.data.data;
      }
      
      console.log('Games Data:', gamesData.length, 'games'); // Debug log
      
      // กรองเกมซ้ำ (ใช้ game_id เป็น unique key)
      const uniqueGames = gamesData.filter((game, index, self) =>
        index === self.findIndex(g => g.game_id === game.game_id)
      );
      
      console.log('Unique Games:', uniqueGames.length, 'games'); // Debug log
      
      setGames(uniqueGames);
      setFilteredGames(uniqueGames);
    } catch (err) {
      console.error('Failed to fetch games', err);
      console.error('Error details:', err.response?.data || err.message);
      showToast('ไม่สามารถโหลดเกมได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDailyReward = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('กรุณาล็อกอินก่อน', 'warning');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/wallet/daily', {});
      showToast(res.data.message, 'success'); 
      fetchUserBalance(); 
    } catch (err) {
      showToast(err.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-red-900 to-black h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('https://wallpapers.com/images/hd/gaming-background-h193859385.jpg')] bg-cover bg-center"></div>
          
          <div className="relative z-10 text-center text-white px-4">
              <h2 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg italic">ลุ้นไอดี <span className="text-yellow-400">เทพมากมาย</span></h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">แหล่งรวมรหัสเกมราคาถูก บริการเติมเกม 24 ชม. ปลอดภัย 100%</p>
              
              <button 
                onClick={() => navigate('/gacha')}
                className="bg-gradient-to-b from-red-500 to-red-700 text-white text-2xl font-bold px-10 py-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-105 transition transform border-4 border-red-400"
              >
                คลิกเพื่อสุ่ม
              </button>
          </div>
      </div>

      {/* Search Bar สำหรับ Mobile */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 mb-6 lg:hidden">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="ค้นหาเกม..." 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-gray-100 rounded-full px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
            />
            {searchQuery ? (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
          {searchQuery && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">พบ {filteredGames.length} รายการ</span>
              <button 
                onClick={clearSearch}
                className="text-red-600 hover:text-red-700 font-bold"
              >
                ล้าง
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Category Grid (เมนูทางลัด) */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 mb-12 hidden lg:block">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div onClick={() => navigate('/gacha')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-red-500 group">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-600 transition">
                      <Gift className="text-red-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">สุ่มของรางวัล</h3>
                  <p className="text-xs text-gray-500">Random Prize</p>
              </div>
              <div onClick={() => navigate('/topup')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-yellow-500 group">
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 transition">
                      <CreditCard className="text-yellow-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">เติมเงินเข้าระบบ</h3>
                  <p className="text-xs text-gray-500">Top-up Wallet</p>
              </div>
              <div onClick={() => navigate('/games')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-blue-500 group">
                   <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition">
                      <Box className="text-blue-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">ไอดีเกมออนไลน์</h3>
                  <p className="text-xs text-gray-500">Game ID Shop</p>
              </div>
              <div onClick={() => navigate('/profile')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-green-500 group">
                   <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-600 transition">
                      <User className="text-green-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">ข้อมูลส่วนตัว</h3>
                  <p className="text-xs text-gray-500">Profile & Stock</p>
              </div>
          </div>
      </div>

      {/* Category Grid สำหรับ Mobile (แสดงเมื่อไม่มีการค้นหา) */}
      {!searchQuery && (
        <div className="max-w-7xl mx-auto px-4 mb-12 lg:hidden">
          <div className="grid grid-cols-2 gap-4">
              <div onClick={() => navigate('/gacha')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-red-500 group">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-600 transition">
                      <Gift className="text-red-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">สุ่มของรางวัล</h3>
              </div>
              <div onClick={() => navigate('/topup')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-yellow-500 group">
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 transition">
                      <CreditCard className="text-yellow-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">เติมเงิน</h3>
              </div>
              <div onClick={() => navigate('/games')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-blue-500 group">
                   <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition">
                      <Box className="text-blue-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">ไอดีเกม</h3>
              </div>
              <div onClick={() => navigate('/profile')} className="bg-white p-4 rounded-xl shadow-lg hover:-translate-y-2 transition cursor-pointer border-b-4 border-green-500 group">
                   <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-600 transition">
                      <User className="text-green-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">โปรไฟล์</h3>
              </div>
          </div>
        </div>
      )}

      {/* 5. Categories Section */}
      {!searchQuery && categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800 uppercase italic">
              หมวดหมู่ <span className="text-red-600">เกม</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <div
                key={category.category_id}
                onClick={() => navigate(`/categories/${category.category_id}`)}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-red-500 group text-center"
              >
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: category.color || '#EF4444' }}
                >
                  <Gamepad2 className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-red-600 transition mb-1">
                  {category.name_th || category.name}
                </h4>
                <p className="text-xs text-gray-500">{category.game_count || 0} เกม</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Recently Viewed */}
      {!searchQuery && recentlyViewed.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800 uppercase italic">
                เกมที่ดู <span className="text-red-600">ล่าสุด</span>
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyViewed.map((game) => (
              <div
                key={game.game_id}
                onClick={() => navigate(`/games/${game.game_id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer group"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={game.image_url}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    onError={(e) => {
                      e.target.src = smallPlaceholder;
                    }}
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm text-gray-800 truncate">{game.name}</h4>
                  <p className="text-xs text-red-600 font-bold mt-1">฿{Number(game.price || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Recommendations */}
      {!searchQuery && recommendations.length > 0 && user && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800 uppercase italic">
                เกมที่ <span className="text-red-600">แนะนำสำหรับคุณ</span>
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 8).map((game) => (
              <div
                key={game.game_id}
                onClick={() => navigate(`/games/${game.game_id}`)}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 group border border-gray-100 cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={game.image_url}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    onError={(e) => {
                      e.target.src = smallPlaceholder;
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                    แนะนำ
                  </div>
                  <button
                    onClick={(e) => toggleWishlist(game.game_id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition ${
                      wishlist.includes(parseInt(game.game_id))
                        ? 'bg-red-600 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart
                      size={16}
                      className={wishlist.includes(parseInt(game.game_id)) ? 'fill-current' : ''}
                    />
                  </button>
                </div>
                <div className="p-5">
                  <h4 className="font-extrabold text-lg text-gray-800 truncate mb-1">{game.name}</h4>
                  <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      {game.original_price && parseFloat(game.original_price) > parseFloat(game.price) && (
                        <p className="text-[10px] text-gray-400 line-through">฿{Number(game.original_price).toFixed(0)}</p>
                      )}
                      <p className="text-xl font-black text-red-600">฿{Number(game.price).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/games/${game.game_id}`);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-bold text-sm flex items-center gap-1"
                    >
                      <ShoppingCart size={16} /> ซื้อ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Game List - แก้ไขให้กดไปหน้ารายละเอียดได้ */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800 uppercase italic">
              {searchQuery ? (
                <>ผลการค้นหา <span className="text-red-600">"{searchQuery}"</span></>
              ) : (
                <>สินค้า <span className="text-red-600">แนะนำ</span></>
              )}
            </h3>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                พบ {filteredGames.length} รายการ
              </span>
              <button 
                onClick={clearSearch}
                className="text-sm text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                <X className="w-4 h-4" /> ล้างการค้นหา
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {searchQuery ? 'ไม่พบผลการค้นหา' : 'ยังไม่มีเกมในระบบ'}
              </h4>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `ไม่พบเกมที่ตรงกับ "${searchQuery}" ลองค้นหาด้วยคำอื่นดูสิ!`
                  : 'รอ Admin เพิ่มเกมเข้ามาในระบบ'
                }
              </p>
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-bold"
                >
                  ล้างการค้นหา
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div 
                key={game.game_id} 
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 group border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/games/${game.game_id}`)}
              >
                <div className="h-48 overflow-hidden relative">
                    <img 
                        src={game.image_url} 
                        alt={game.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        onError={(e) => {
                          e.target.src = smallPlaceholder;
                        }}
                    />
                    <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm uppercase">
                        {game.platform}
                    </div>
                    <button
                      onClick={(e) => toggleWishlist(game.game_id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition ${
                        wishlist.includes(parseInt(game.game_id))
                          ? 'bg-red-600 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-white'
                      }`}
                      title={wishlist.includes(parseInt(game.game_id)) ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                    >
                      <Heart 
                        size={16} 
                        className={wishlist.includes(parseInt(game.game_id)) ? 'fill-current' : ''}
                      />
                    </button>
                </div>

                <div className="p-5">
                  <h4 className="font-extrabold text-lg text-gray-800 truncate mb-1">{game.name}</h4>
                  <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2">{game.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 line-through">฿{Number(game.price * 1.2).toFixed(0)}</p>
                        <p className="text-xl font-black text-red-600">฿{Number(game.price).toLocaleString()}</p>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/games/${game.game_id}`);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition active:scale-95 shadow-lg text-sm font-bold"
                      title="ดูรายละเอียด"
                    >
                      ดูเพิ่ม
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 text-center border-t-4 border-red-600">
          <h2 className="text-2xl font-bold mb-2">NICKY<span className="text-red-600">KEY</span></h2>
          <p className="text-gray-500 text-sm">Copyright © 2025 GameKey Market. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;