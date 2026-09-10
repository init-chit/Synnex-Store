import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import StarRating from './StarRating';

function ReviewCard({ review, onHelpful }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
            {review.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{review.username || 'Anonymous'}</span>
              {review.is_verified_purchase && (
                <CheckCircle className="w-4 h-4 text-green-500" title="Verified Purchase" />
              )}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(review.created_at).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size={18} />
      </div>

      {review.comment && (
        <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
          {review.comment}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => onHelpful && onHelpful(review.review_id)}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition text-sm"
        >
          <ThumbsUp size={16} />
          <span>มีประโยชน์ ({review.helpful_count || 0})</span>
        </button>
        {review.updated_at !== review.created_at && (
          <span className="text-xs text-gray-500">แก้ไขแล้ว</span>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;

