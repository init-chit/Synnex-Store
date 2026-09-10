import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { Gift, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastContainer';

function Gacha() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchBoxes(); }, []);

  const fetchBoxes = async () => {
    try {
      const res = await axiosInstance.get('/api/gacha');
      setBoxes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async (boxId, price) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please sign in before opening a mystery box', 'warning');
      navigate('/login');
      return;
    }
    if (!window.confirm(`Confirm opening this mystery box for ${price} MMK?`)) return;
    setSpinning(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await axiosInstance.post('/api/gacha/spin', { box_id: boxId }, { headers: { Authorization: `Bearer ${token}` } });
      const prize = res.data.prize;
      if (prize.type === 'salt') {
        showToast(`😢 No luck! You received: ${prize.name} | Remaining balance: ${res.data.remaining_balance} MMK`, 'warning');
      } else {
        showToast(`🎉 Congratulations! You received: ${prize.name} | ${prize.prize_data}`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'An error occurred while opening the mystery box', 'error');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-4 animate-pulse">🎲 Mystery Gacha Shop</h1>
        <p className="text-gray-600">Try your luck and win premium game codes!</p>
        <button onClick={() => navigate('/')} className="mt-4 text-sm text-red-600 hover:text-red-700 underline font-bold">Back to Home</button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center col-span-3 text-gray-600">Loading mystery boxes...</p>
        ) : (
          boxes.map((box) => (
            <div key={box.box_id} className="bg-white border-2 border-red-500/30 rounded-2xl overflow-hidden hover:border-red-500 transition duration-300 shadow-lg shadow-red-500/20 transform hover:-translate-y-2">
              <div className="h-56 bg-gradient-to-br from-red-500 via-red-600 to-red-800 relative overflow-hidden group">
                {box.image_url && box.image_url.trim() !== '' ? <img src={box.image_url} alt={box.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" onError={(e) => { e.target.style.display = 'none'; const placeholder = e.target.parentElement.querySelector('.gacha-placeholder'); if (placeholder) placeholder.classList.remove('hidden'); }} /> : null}
                <div className={`gacha-placeholder flex flex-col items-center justify-center h-full ${box.image_url && box.image_url.trim() !== '' ? 'hidden' : ''}`}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-3 animate-pulse"><Gift className="w-20 h-20 text-white" /></div>
                  <div className="text-white font-bold text-lg drop-shadow-lg text-center px-4">{box.name}</div>
                  <div className="text-white/80 text-sm mt-1">🎁 Mystery Box</div>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full shadow-lg z-10">{box.price} MMK</div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2 text-red-600">{box.name}</h3>
                <p className="text-sm text-gray-600 mb-6">{box.description || 'Win exciting rewards!'}</p>
                <button onClick={() => handleSpin(box.box_id, box.price)} disabled={spinning} className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 text-white ${spinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95'}`}>
                  {spinning ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Opening...</span> : 'Open Now! 🎲'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Gacha;
