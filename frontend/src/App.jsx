import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import TopUp from './pages/TopUp';
import Gacha from './pages/Gacha';
import Inventory from './pages/Inventory';
import Admin from './pages/Admin';
import AdminPaymentMethods from './pages/AdminPaymentMethods';
import AdminTopUps from './pages/AdminTopUps';
import Profile from './pages/Profile';
import GameDetail from './pages/GameDetail';
import AllGames from './pages/AllGames';
import Categories from './pages/Categories';
import OrderHistory from './pages/OrderHistory';
import CompareGames from './pages/CompareGames';
import ToastContainer from './components/ToastContainer';
import ThemeToggle from './components/ThemeToggle';
import BrandingGuard from './components/BrandingGuard';
import EnglishUiGuard from './components/EnglishUiGuard';

function App() {
  return (
    <>
      <BrandingGuard />
      <EnglishUiGuard />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/topup" element={<TopUp />} />
        <Route path="/gacha" element={<Gacha />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/payment-methods" element={<AdminPaymentMethods />} />
        <Route path="/admin/topups" element={<AdminTopUps />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/games" element={<AllGames />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<Categories />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/compare" element={<CompareGames />} />
      </Routes>
      <ThemeToggle />
      <ToastContainer />
    </>
  );
}

export default App;
