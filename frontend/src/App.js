// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import component Navbar
import Navbar from './components/Navbar';

// Import các trang của bạn
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

// === BƯỚC 1: IMPORT THÊM 2 TRANG MỚI ===
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


// Import file CSS toàn cục
import './App.css'; 

function App() {
  return (
    <Router>
      {/* Navbar sẽ luôn hiển thị ở trên cùng */}
      <Navbar />

      {/* Bọc nội dung chính trong một thẻ main để dễ dàng style */}
      <main className="main-container">
        <Routes>
          {/* Các Route của bạn */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Ví dụ về route được bảo vệ */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          
          {/* === BƯỚC 2: THÊM 2 ROUTE MỚI VÀO ĐÂY === */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
        </Routes>
      </main>
    </Router>
  );
}

export default App;