import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { Star, ThumbsUp, Edit, Trash2, Send, X } from 'lucide-react';
import { showToast } from './ToastContainer';

function ReviewSection({ gameId, userId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReviews();
  }, [gameId, sortBy]);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/api/reviews/game/${gameId}?sort=${sortBy}`);
      setReviews(res.data.reviews || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      showToast('กรุณากรอกคะแนนและความคิดเห็น', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('กรุณาเข้าสู่ระบบก่อน', 'warning');
        return;
      }

      if (editingReview) {
        await axiosInstance.put(`/api/reviews/${editingReview.review_id}`, reviewForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('แก้ไขรีวิวสำเร็จ!', 'success');
      } else {
        await axiosInstance.post(`/api/reviews/game/${gameId}`, reviewForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('เพิ่มรีวิวสำเร็จ!', 'success');
      }

      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.error || 'เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({ rating: review.rating, comment: review.comment || '' });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('ยืนยันการลบรีวิวนี้?')) return;

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('ลบรีวิวสำเร็จ!', 'success');
      fetchReviews();
    } catch (err) {
      showToast('เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await axiosInstance.post(`/api/reviews/${reviewId}/helpful`);
      fetchReviews();
    } catch (err) {
      console.error('Failed to mark helpful', err);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            style={interactive ? { cursor: 'pointer' } : {}}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">กำลังโหลด...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">รีวิว</h2>
        {userId && (
          <button
            onClick={() => {
              setShowReviewForm(!showReviewForm);
              if (showReviewForm) {
                setEditingReview(null);
                setReviewForm({ rating: 5, comment: '' });
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-bold"
          >
            {showReviewForm ? 'ยกเลิก' : 'เขียนรีวิว'}
          </button>
        )}
      </div>

      {/* Review Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-red-50 rounded-lg">
          <div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-black text-red-600">{parseFloat(stats.avg_rating || 0).toFixed(1)}</p>
                {renderStars(Math.round(parseFloat(stats.avg_rating || 0)))}
                <p className="text-sm text-gray-600 mt-1">{stats.total_reviews || 0} รีวิว</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats[`${star}_star`] || 0;
              const total = stats.total_reviews || 1;
              const percentage = (count / total) * 100;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-12">{star} ดาว</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">คะแนน</label>
              {renderStars(reviewForm.rating, true, (rating) =>
                setReviewForm({ ...reviewForm, rating })
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">ความคิดเห็น</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none"
                rows="4"
                placeholder="เขียนรีวิวของคุณ..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-bold flex items-center gap-2"
              >
                <Send size={18} /> {editingReview ? 'บันทึกการแก้ไข' : 'ส่งรีวิว'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setReviewForm({ rating: 5, comment: '' });
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sort Options */}
      <div className="mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none"
        >
          <option value="newest">ใหม่ล่าสุด</option>
          <option value="oldest">เก่าที่สุด</option>
          <option value="highest">คะแนนสูงสุด</option>
          <option value="lowest">คะแนนต่ำสุด</option>
          <option value="helpful">มีประโยชน์มากที่สุด</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>ยังไม่มีรีวิว</p>
            {userId && <p className="text-sm mt-2">เป็นคนแรกที่รีวิวเกมนี้!</p>}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.review_id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold">{review.username || 'ผู้ใช้ไม่ระบุชื่อ'}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      {review.is_verified_purchase && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          ✓ ซื้อแล้ว
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {userId === review.user_id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.review_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button
                  onClick={() => handleMarkHelpful(review.review_id)}
                  className="flex items-center gap-1 hover:text-red-600 transition"
                >
                  <ThumbsUp size={16} /> มีประโยชน์ ({review.helpful_count || 0})
                </button>
                <span>{new Date(review.created_at).toLocaleDateString('th-TH')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;




