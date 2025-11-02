// frontend/src/AddUser.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AddUser({ onUserAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Để quản lý trạng thái tải
  const [error, setError] = useState(null);     // Để lưu thông báo lỗi (phải là string hoặc null)
  const [success, setSuccess] = useState(false); // Để hiển thị thông báo thành công

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (reload trang)

    // Reset các thông báo cũ
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const newUser = { name, email };
      // Gọi API POST để thêm người dùng
      // SỬ DỤNG ĐÚNG URL API CÓ '/api'
      await axios.post('http://192.168.110.208:3000/api/users', newUser);

      // Nếu thành công:
      setName(''); // Xóa các trường input
      setEmail('');
      setSuccess(true); // Hiển thị thông báo thành công
      if (onUserAdded) {
        onUserAdded(); // Gọi hàm callback để thông báo cho App.js (và UserList) rằng đã có user mới
      }
    } catch (err) {
      console.error('Lỗi khi thêm người dùng:', err);
      // Xử lý lỗi từ API hoặc mạng
      if (err.response) {
        // Lỗi từ server (có phản hồi HTTP)
        setError(err.response.data.message || 'Thêm người dùng thất bại. Vui lòng thử lại.');
      } else if (err.request) {
        // Lỗi không có phản hồi từ server (ví dụ: server không chạy)
        setError('Không thể kết nối đến server. Vui lòng kiểm tra API backend.');
      } else {
        // Lỗi khác
        setError('Đã xảy ra lỗi không xác định.');
      }
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };

  return (
    <div>
      <h2>Thêm người dùng mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Tên:</label>
          <input
            id="name"
            type="text"
            placeholder="Nhập tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required // Trường bắt buộc
            disabled={loading} // Tắt input khi đang tải
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email" // Sử dụng type="email" để kiểm tra định dạng email
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm người dùng'}
        </button>
      </form>

      {/* Hiển thị thông báo lỗi hoặc thành công */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Người dùng đã được thêm thành công!</p>}
    </div>
  );
}

export default AddUser;