import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import Loader from './components/loader/Loader';

// Pages (mirroring Angular routing)
import Home from './components/home/Home';
import Dashboard from './components/dashboard/Dashboard';
import Deposit from './components/deposit/Deposit';
import Withdraw from './components/withdraw/Withdraw';
import FundTransfer from './components/fundTransfer/FundTransfer';
import AccountPin from './components/accountPin/AccountPin';
import AccountDetailCard from './components/accountDetailCard/AccountDetailCard';
import TransactionHistory from './components/transactionHistory/TransactionHistory';
import UserProfileCard from './components/userprofilecard/UserProfileCard';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Otp from './components/otp/Otp';
import ResetPassword from './components/resetPassword/ResetPassword';
import Profile from './components/profile/Profile';
import NotFoundPage from './components/notfoundpage/NotFoundPage';

import { AuthProvider } from './context/AuthContext';
import AuthGuard from './routes/AuthGuard';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="content-wrapper flex w-screen h-screen absolute overflow-y-hidden">
        {/* Sidebar */}
        <div className="left-pannel sticky top-0">
          <Sidebar />
        </div>

        {/* Main Panel */}
        <div className="right-pannel bg-[#edf2f9] flex flex-col flex-1 overflow-y-scroll">
          <Header />

          <div className="p-[5px] md:p-2 w-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login/otp" element={<Otp />} />
              <Route path="/forget-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
              <Route path="/account/deposit" element={<AuthGuard><Deposit /></AuthGuard>} />
              <Route path="/account/withdraw" element={<AuthGuard><Withdraw /></AuthGuard>} />
              <Route path="/account/fund-transfer" element={<AuthGuard><FundTransfer /></AuthGuard>} />
              <Route path="/account/pin" element={<AuthGuard><AccountPin /></AuthGuard>} />
              <Route path="/account" element={<AuthGuard><AccountDetailCard /></AuthGuard>} />
              <Route path="/user/profile" element={<AuthGuard><Profile /></AuthGuard>} />
              <Route path="/account/transaction-history" element={<AuthGuard><TransactionHistory /></AuthGuard>} />

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Global Loader (like <app-loader>) */}
      <Loader />

      {/* Toast Container (like <lib-toastify-toast-container>) */}
      <ToastContainer position="bottom-right" icon={true} />
    </Router>
    </AuthProvider>
  );
}

export default App;
