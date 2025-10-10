# Dự án Quản lý Người dùng - Nhóm 18

Đây là dự án thực hành Fullstack xây dựng một ứng dụng web đơn giản sử dụng MERN Stack (MongoDB, Express, React, Node.js) và quản lý code bằng Git & GitHub.

## Thành viên nhóm

*   **Nguyễn Chí Toại** (Trưởng nhóm): Phụ trách Backend (Node.js, Express) và Database (MongoDB).
*   **Hồng Phước Thịnh**: Phụ trách Frontend (React).

---

## Công nghệ sử dụng

### Backend
*   **Node.js**: Môi trường chạy JavaScript phía server.
*   **Express.js**: Framework xây dựng API.
*   **MongoDB Atlas**: Dịch vụ cơ sở dữ liệu NoSQL trên đám mây.
*   **Mongoose**: Thư viện giúp tương tác với MongoDB.
*   **CORS**: Middleware xử lý Cross-Origin Resource Sharing.
*   **Dotenv**: Quản lý biến môi trường.

### Frontend
*   **React**: Thư viện xây dựng giao diện người dùng.
*   **Axios**: Thư viện để thực hiện các HTTP request.
*   **CSS**: Tạo kiểu cho giao diện.

---

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu
*   Node.js (phiên bản LTS)
*   Git
*   Một tài khoản MongoDB Atlas

### Các bước cài đặt

1.  **Clone repository về máy:**
    ```bash
    git clone <URL_repository_của_bạn>
    cd group18-project
    ```

2.  **Cài đặt Backend:**
    *   Di chuyển vào thư mục backend và cài đặt các thư viện cần thiết:
        ```bash
        cd backend
        npm install
        ```
    *   Tạo một file `.env` trong thư mục `backend` và thêm chuỗi kết nối MongoDB Atlas của bạn:
        ```
        MONGO_URI=mongodb+srv://...
        ```

3.  **Cài đặt Frontend:**
    *   Mở một terminal mới, từ thư mục gốc, di chuyển vào thư mục frontend và cài đặt:
        ```bash
        cd frontend
        npm install
        ```

### Chạy ứng dụng

Bạn cần mở 2 terminal riêng biệt:

1.  **Chạy Backend Server:**
    ```bash
    # Từ thư mục gốc group18-project
    cd backend
    npm run dev
    ```
    *Server sẽ chạy tại `http://localhost:3000`.*

2.  **Chạy Frontend Client:**
    ```bash
    # Từ thư mục gốc group18-project
    cd frontend
    npm start
    ```
    *Ứng dụng sẽ tự động mở trong trình duyệt tại `http://localhost:3001`.*
