import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { Clock, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null); // เอาไว้ทำ Effect ปุ่ม Copy
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await axiosInstance.get('/api/transactions/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // คืนค่าปุ่มหลัง 2 วิ
  };

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('th-TH');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
            <Clock className="text-red-600" /> ประวัติการสั่งซื้อ & คลังของฉัน
          </h1>
          <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition">
            กลับหน้าหลัก
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-600">กำลังโหลดข้อมูล...</div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-gray-600">ยังไม่มีประวัติการซื้อ (ไปช้อปก่อนสิ!)</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-red-600 text-white uppercase text-sm">
                  <tr>
                    <th className="p-4">วันที่</th>
                    <th className="p-4">รายการ / รายละเอียด</th>
                    <th className="p-4 text-right">ราคา</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {history.map((item) => (
                    <tr key={item.transaction_id} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(item.transaction_date)}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800 mb-1">
                            {/* แยกชื่อสินค้าออกจากรายละเอียด (ถ้ามี) */}
                            {item.details || 'Unknown Item'}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-red-600">
                        -฿{Number(item.amount).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        {item.details && (
                           <button 
                             onClick={() => handleCopy(item.details, item.transaction_id)}
                             className="text-gray-600 hover:text-red-600 transition"
                             title="คัดลอก"
                           >
                             {copiedId === item.transaction_id ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                           </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;