import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { ArrowLeft, Gamepad2, Package } from 'lucide-react';
import { GameCardSkeleton } from '../components/LoadingSkeleton';
import StarRating from '../components/StarRating';
import { gamePlaceholder } from '../utils/imagePlaceholder';

function Categories() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchCategoryGames(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategoryGames = async (categoryId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/categories/${categoryId}`);
      setSelectedCategory(res.data.category);
      setGames(res.data.games);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-6"
          >
            <ArrowLeft size={20} />
            <span>กลับหน้าหลัก</span>
          </button>

          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Gamepad2 className="w-10 h-10" />
            หมวดหมู่เกม
          </h1>
          <p className="text-gray-300">
            เลือกหมวดหมู่ที่คุณสนใจ
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!id ? (
          /* Categories Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.category_id}
                onClick={() => navigate(`/categories/${category.category_id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer group border-2 border-transparent hover:border-red-500"
              >
                <div
                  className="h-32 flex items-center justify-center"
                  style={{ backgroundColor: category.color || '#6366F1' }}
                >
                  <Gamepad2 className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-red-600 transition">
                    {category.name_th}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{category.name}</p>
                  <div className="text-xs text-gray-400">
                    {category.game_count || 0} เกม
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Games in Category */
          <>
            {selectedCategory && (
              <div className="mb-8">
                <div
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-bold mb-4"
                  style={{ backgroundColor: selectedCategory.color || '#6366F1' }}
                >
                  <Gamepad2 className="w-6 h-6" />
                  <span className="text-2xl">{selectedCategory.name_th}</span>
                  <span className="text-lg opacity-80">({selectedCategory.name})</span>
                </div>
                <p className="text-gray-600">
                  พบ {games.length} เกมในหมวดหมู่นี้
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))}
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-xl">ยังไม่มีเกมในหมวดหมู่นี้</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {games.map((game) => (
                  <div
                    key={game.game_id}
                    onClick={() => navigate(`/games/${game.game_id}`)}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 group border border-gray-100 cursor-pointer"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={game.image_url}
                        onError={(e) => { e.target.src = gamePlaceholder; }}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm uppercase">
                        {game.platform}
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="font-extrabold text-lg text-gray-800 truncate mb-1">
                        {game.name}
                      </h4>
                      {game.avg_rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <StarRating rating={parseFloat(game.avg_rating)} size={14} showNumber={true} />
                          <span className="text-xs text-gray-400">
                            ({game.review_count || 0})
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2">
                        {game.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          {game.original_price && (
                            <p className="text-[10px] text-gray-400 line-through">
                              ฿{Number(game.original_price).toLocaleString()}
                            </p>
                          )}
                          <p className="text-xl font-black text-red-600">
                            ฿{Number(game.price).toLocaleString()}
                          </p>
                        </div>

                        <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition active:scale-95 shadow-lg text-sm font-bold">
                          ดูเพิ่ม
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Categories;

