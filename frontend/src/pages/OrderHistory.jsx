import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { ArrowLeft, Package, Calendar, DollarSign, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import { showToast } from '../components/ToastContainer';
import { smallPlaceholder } from '../utils/imagePlaceholder';

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/api/transactions/history');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      showToast('ไม่สามารถโหลดประวัติการสั่งซื้อได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'สำเร็จ';
      case 'pending':
        return 'รอดำเนินการ';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.game_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPlatform = filterPlatform === 'all' || order.platform === filterPlatform;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const totalSpent = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-black mb-2">ประวัติการสั่งซื้อ</h1>
          <p className="text-red-100">ดูประวัติการซื้อเกมทั้งหมดของคุณ</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">ยอดซื้อรวม</p>
                <p className="text-2xl font-bold text-red-600">฿{totalSpent.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
              </div>
              <DollarSign className="text-red-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">จำนวนคำสั่งซื้อ</p>
                <p className="text-2xl font-bold text-red-600">{orders.length}</p>
              </div>
              <Package className="text-red-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">คำสั่งซื้อที่สำเร็จ</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ค้นหาเกม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="completed">สำเร็จ</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none"
            >
              <option value="all">แพลตฟอร์มทั้งหมด</option>
              <option value="Steam">Steam</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Nintendo">Nintendo</option>
              <option value="Epic Games">Epic Games</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400" size={64} />
              <p className="mt-4 text-gray-600 text-lg">ไม่พบประวัติการสั่งซื้อ</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-600 to-red-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">เกม</th>
                    <th className="px-6 py-4 text-left">แพลตฟอร์ม</th>
                    <th className="px-6 py-4 text-left">ราคา</th>
                    <th className="px-6 py-4 text-left">สถานะ</th>
                    <th className="px-6 py-4 text-left">วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.transaction_id} className="border-b hover:bg-red-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.game_image && (
                            <img
                              src={order.game_image}
                              alt={order.game_name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = smallPlaceholder;
                              }}
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{order.game_name || 'ไม่ระบุชื่อเกม'}</p>
                            {order.details && (
                              <p className="text-sm text-gray-500">{order.details}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                          {order.platform || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-red-600">
                          ฿{parseFloat(order.amount || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </p>
                        {order.original_amount && parseFloat(order.original_amount) > parseFloat(order.amount) && (
                          <p className="text-sm text-gray-400 line-through">
                            ฿{parseFloat(order.original_amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold">{getStatusText(order.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <span className="text-sm">{formatDate(order.transaction_date)}</span>
                        </div>
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

export default OrderHistory;




