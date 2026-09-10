import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { ArrowLeft, Plus, X, ShoppingCart, Star, DollarSign, Package, TrendingUp } from 'lucide-react';
import { showToast } from '../components/ToastContainer';
import { smallPlaceholder } from '../utils/imagePlaceholder';

function CompareGames() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axiosInstance.get('/api/games');
      setGames(res.data || []);
    } catch (err) {
      console.error('Failed to fetch games', err);
    }
  };

  const addToCompare = (game) => {
    if (selectedGames.length >= 3) {
      showToast('เปรียบเทียบได้สูงสุด 3 เกม', 'warning');
      return;
    }
    if (selectedGames.find(g => g.game_id === game.game_id)) {
      showToast('เกมนี้ถูกเพิ่มแล้ว', 'warning');
      return;
    }
    setSelectedGames([...selectedGames, game]);
    setShowSearch(false);
    setSearchTerm('');
  };

  const removeFromCompare = (gameId) => {
    setSelectedGames(selectedGames.filter(g => g.game_id !== gameId));
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedGames.find(g => g.game_id === game.game_id)
  );

  const getComparisonValue = (game, field) => {
    switch (field) {
      case 'price':
        return `฿${parseFloat(game.price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
      case 'discount':
        if (game.original_price && parseFloat(game.original_price) > parseFloat(game.price)) {
          const discount = ((parseFloat(game.original_price) - parseFloat(game.price)) / parseFloat(game.original_price)) * 100;
          return `${discount.toFixed(0)}%`;
        }
        return '-';
      case 'platform':
        return game.platform || 'N/A';
      case 'developer':
        return game.developer || 'N/A';
      case 'publisher':
        return game.publisher || 'N/A';
      default:
        return '-';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-white hover:text-red-200 transition"
          >
            <ArrowLeft size={20} /> กลับ
          </button>
          <h1 className="text-3xl font-black mb-2">เปรียบเทียบเกม</h1>
          <p className="text-red-100">เปรียบเทียบเกมสูงสุด 3 เกม</p>
        </div>

        {/* Add Games Section */}
        {selectedGames.length < 3 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-bold"
            >
              <Plus size={20} /> เพิ่มเกมเพื่อเปรียบเทียบ ({selectedGames.length}/3)
            </button>

            {showSearch && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="ค้นหาเกม..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none mb-4"
                />
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredGames.slice(0, 10).map((game) => (
                    <div
                      key={game.game_id}
                      onClick={() => addToCompare(game)}
                      className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg cursor-pointer transition"
                    >
                      {game.image_url && (
                        <img
                          src={game.image_url}
                          alt={game.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = smallPlaceholder;
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">{game.name}</p>
                        <p className="text-sm text-gray-500">{game.platform}</p>
                      </div>
                      <p className="font-bold text-red-600">
                        ฿{parseFloat(game.price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comparison Table */}
        {selectedGames.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-600 to-red-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">รายการ</th>
                    {selectedGames.map((game) => (
                      <th key={game.game_id} className="px-6 py-4 text-center min-w-[250px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(game.game_id)}
                            className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full p-1 hover:bg-red-900 transition"
                          >
                            <X size={16} />
                          </button>
                          {game.image_url && (
                            <img
                              src={game.image_url}
                              alt={game.name}
                              className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                              onError={(e) => {
                                e.target.src = smallPlaceholder;
                              }}
                            />
                          )}
                          <p className="font-bold">{game.name}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-red-50">
                    <td className="px-6 py-4 font-semibold">ราคา</td>
                    {selectedGames.map((game) => (
                      <td key={game.game_id} className="px-6 py-4 text-center">
                        <p className="font-bold text-red-600 text-lg">
                          {getComparisonValue(game, 'price')}
                        </p>
                        {game.original_price && parseFloat(game.original_price) > parseFloat(game.price) && (
                          <p className="text-sm text-gray-400 line-through">
                            ฿{parseFloat(game.original_price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-red-50">
                    <td className="px-6 py-4 font-semibold">ส่วนลด</td>
                    {selectedGames.map((game) => (
                      <td key={game.game_id} className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          {getComparisonValue(game, 'discount')}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-red-50">
                    <td className="px-6 py-4 font-semibold">แพลตฟอร์ม</td>
                    {selectedGames.map((game) => (
                      <td key={game.game_id} className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                          {getComparisonValue(game, 'platform')}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-red-50">
                    <td className="px-6 py-4 font-semibold">ผู้พัฒนา</td>
                    {selectedGames.map((game) => (
                      <td key={game.game_id} className="px-6 py-4 text-center">
                        {getComparisonValue(game, 'developer')}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-red-50">
                    <td className="px-6 py-4 font-semibold">ผู้จัดพิมพ์</td>
                    {selectedGames.map((game) => (
                      <td key={game.game_id} className="px-6 py-4 text-center">
                        {getComparisonValue(game, 'publisher')}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-red-50">
                    <td className="px-6 py-4 font-semibold">คำอธิบาย</td>
                    {selectedGames.map((game) => (
                      <td key={game.game_id} className="px-6 py-4 text-center">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {game.description || 'ไม่มีคำอธิบาย'}
                        </p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">การดำเนินการ</td>
                    {selectedGames.map((game) => (
                      <td key={game.game_id} className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/games/${game.game_id}`)}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-bold flex items-center gap-2 mx-auto"
                        >
                          <ShoppingCart size={18} /> ดูรายละเอียด
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <TrendingUp className="mx-auto text-gray-400" size={64} />
            <p className="mt-4 text-gray-600 text-lg">ยังไม่มีเกมที่เลือก</p>
            <p className="text-gray-500">เพิ่มเกมเพื่อเริ่มเปรียบเทียบ</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompareGames;




