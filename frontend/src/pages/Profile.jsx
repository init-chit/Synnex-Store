import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { User, Mail, Shield, Lock, CreditCard, ShoppingBag, LogOut, Save, ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastContainer';
import { smallPlaceholder } from '../utils/imagePlaceholder';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalSpent: 0, totalItems: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [wishlistGames, setWishlistGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Form เปลี่ยนรหัสผ่าน
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
    fetchHistoryStats();
    fetchWishlist();
    fetchReviews();
  }, []);

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchWishlistGames();
    }
  }, [wishlist]);

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get('/api/wishlist');
      const gameIds = res.data.map(item => item.game_id);
      setWishlist(gameIds);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  };

  const fetchWishlistGames = async () => {
    try {
      const res = await axiosInstance.get('/api/games');
      const gamesData = res.data.games || res.data || [];
      const games = gamesData.filter(g => wishlist.includes(g.game_id));
      setWishlistGames(games);
    } catch (err) {
      console.error('Failed to fetch wishlist games', err);
    }
  };

  const removeFromWishlist = async (gameId) => {
    try {
      await axiosInstance.post(`/api/wishlist/toggle/${gameId}`);
      setWishlist(wishlist.filter(id => id !== gameId));
      showToast('ลบออกจากรายการโปรดแล้ว', 'info');
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
      showToast('เกิดข้อผิดพลาด', 'error');
    }
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      const res = await axiosInstance.get('/api/wallet/me');
      setProfile(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchHistoryStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.get('/api/transactions/history');
      
      // คำนวณยอดซื้อรวม และจำนวนของที่ซื้อ
      const history = res.data;
      const spent = history.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      setStats({ totalSpent: spent, totalItems: history.length });
    } catch (err) { console.error(err); }
  };

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get('/api/reviews/user/my-reviews');
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      showToast('รหัสผ่านใหม่ไม่ตรงกัน', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/api/auth/change-password', {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword
      });
      
      showToast('เปลี่ยนรหัสผ่านสำเร็จ!', 'success');
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!profile) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-2">
            <User className="w-8 h-8 text-red-600" /> ข้อมูลส่วนตัว (My Profile)
          </h1>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition bg-white px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm border border-gray-200">
            <ArrowLeft size={20} /> กลับหน้าหลัก
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Profile Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-red-600 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-red-100">
                    <User className="w-12 h-12 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
                <p className="text-gray-500 text-sm mb-4">{profile.email}</p>
                
                <div className="inline-block bg-gray-100 px-4 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider mb-6">
                    MEMBER ROLE: <span className={profile.user_id === 1 || profile.role === 'admin' ? "text-red-600" : "text-blue-600"}>
                        {profile.role || 'USER'}
                    </span>
                </div>

                <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100 transition flex items-center justify-center gap-2">
                    <LogOut size={18} /> ออกจากระบบ
                </button>
            </div>

            {/* Wallet Summary */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">ยอดเงินคงเหลือ</span>
                    <CreditCard className="text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-yellow-400">฿{Number(profile.wallet_balance).toLocaleString()}</div>
                <button onClick={() => navigate('/topup')} className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-bold transition">
                    + เติมเงินเพิ่ม
                </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Stats & Edit Password */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><ShoppingBag size={20} /></div>
                        <span className="text-gray-500 text-sm font-bold">สินค้าที่ซื้อไป</span>
                    </div>
                    <div className="text-2xl font-black text-gray-800">{stats.totalItems} รายการ</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><CreditCard size={20} /></div>
                        <span className="text-gray-500 text-sm font-bold">ยอดใช้จ่ายรวม</span>
                    </div>
                    <div className="text-2xl font-black text-gray-800">฿{stats.totalSpent.toLocaleString()}</div>
                </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Lock className="text-red-600" size={20} /> เปลี่ยนรหัสผ่าน
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านเดิม</label>
                        <input type="password" required 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                            value={passForm.oldPassword}
                            onChange={e => setPassForm({...passForm, oldPassword: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
                            <input type="password" required 
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                                value={passForm.newPassword}
                                onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                            <input type="password" required 
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                                value={passForm.confirmPassword}
                                onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center gap-2">
                        <Save size={18} /> บันทึกการเปลี่ยนแปลง
                    </button>
                </form>
            </div>

            {/* Wishlist Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Heart className="text-red-600 fill-current" size={20} /> รายการโปรดของฉัน
                </h3>
                {wishlist.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">ยังไม่มีเกมในรายการโปรด</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistGames.map((game) => (
                      <div 
                        key={game.game_id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-red-500 transition cursor-pointer group"
                        onClick={() => navigate(`/games/${game.game_id}`)}
                      >
                        <div className="flex items-start gap-3">
                          <img 
                            src={game.image_url}
                            onError={(e) => { e.target.src = smallPlaceholder; }} 
                            alt={game.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 truncate mb-1">{game.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{game.platform}</p>
                            <p className="text-red-600 font-bold">฿{Number(game.price).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromWishlist(game.game_id);
                            }}
                            className="text-gray-400 hover:text-red-600 transition"
                            title="ลบออกจากรายการโปรด"
                          >
                            <Heart size={18} className="fill-current text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <ShoppingBag className="text-red-600" size={20} /> รีวิวของฉัน ({reviews.length})
                </h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>คุณยังไม่ได้รีวิวเกมใดๆ</p>
                    <button 
                      onClick={() => navigate('/games')}
                      className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-bold"
                    >
                      ไปซื้อเกมและรีวิว
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.review_id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start gap-4">
                          {review.game_image && (
                            <img
                              src={review.game_image}
                              alt={review.game_name}
                              className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                              onClick={() => navigate(`/games/${review.game_id}`)}
                              onError={(e) => {
                                e.target.src = smallPlaceholder;
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <h4 
                              className="font-bold text-lg cursor-pointer hover:text-red-600 transition"
                              onClick={() => navigate(`/games/${review.game_id}`)}
                            >
                              {review.game_name}
                            </h4>
                            <p className="text-sm text-gray-500 mb-2">{review.platform}</p>
                            <div className="flex items-center gap-2 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment || 'ไม่มีความคิดเห็น'}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(review.created_at).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;