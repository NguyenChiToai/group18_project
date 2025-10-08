// frontend/src/UserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList({ refresh }) { // Prop 'refresh' dùng để kích hoạt tải lại
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null);    // Thông báo lỗi (phải là string hoặc null)

  // Hàm để gọi API lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // Reset lỗi trước khi fetch mới

    try {
      // Gọi API GET để lấy danh sách người dùng
      // SỬ DỤNG ĐÚNG URL API CÓ '/api'
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data); // Lưu dữ liệu vào state
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
      if (err.response) {
        setError(err.response.data.message || 'Không thể tải danh sách người dùng.');
      } else if (err.request) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra API backend.');
      } else {
        setError('Đã xảy ra lỗi không xác định khi tải người dùng.');
      }
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };

  // useEffect sẽ chạy khi component được mount lần đầu và mỗi khi prop 'refresh' thay đổi
  useEffect(() => {
    fetchUsers();
  }, [refresh]); // Dependencies array: khi refresh thay đổi, fetchUsers được gọi lại

  if (loading) {
    return <p>Đang tải danh sách người dùng...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Lỗi: {error}</p>;
  }

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào được thêm.</p>
      ) : (
        <ul>
          {users.map((user) => (
            // Quan trọng: Phải hiển thị thuộc tính cụ thể của user, không phải toàn bộ đối tượng user
            // Đảm bảo mỗi user có thuộc tính 'id' duy nhất cho key
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;