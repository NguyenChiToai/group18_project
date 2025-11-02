# Dự án Quản lý Người dùng Nâng cao - Nhóm 18

Đây là dự án Fullstack hoàn chỉnh xây dựng một ứng dụng web bảo mật và giàu tính năng sử dụng MERN Stack (MongoDB, Express, React, Node.js). Dự án được quản lý chuyên nghiệp bằng quy trình Git Workflow với phân chia nhánh và Pull Request.

## Thành viên nhóm

*   **Nguyễn Chí Toại** (Trưởng nhóm): Phụ trách Backend (Node.js, Express), Database (MongoDB), và quản lý Git.
*   **Hồng Phước Thịnh**: Phụ trách Frontend (React, Redux).

---

## Các tính năng chính

### Chức năng cơ bản
*   ✅ **Authentication**: Đăng ký, Đăng nhập, Đăng xuất.
*   ✅ **User Management**: Người dùng có thể xem và cập nhật thông tin cá nhân (tên, email, mật khẩu).
*   ✅ **Session Management**: Duy trì trạng thái đăng nhập của người dùng.

### Chức năng nâng cao
*   🔐 **Refresh Token**: Tự động làm mới phiên đăng nhập khi hết hạn, mang lại trải nghiệm người dùng liền mạch và bảo mật cao.
*   👑 **Phân quyền (RBAC)**: Hệ thống phân chia vai trò `User` và `Admin` rõ ràng. Admin có quyền truy cập vào các trang quản trị đặc biệt.
*   🖼️ **Upload Avatar**: Người dùng có thể tải lên và thay đổi ảnh đại diện, ảnh được xử lý và lưu trữ trên dịch vụ **Cloudinary**.
*   🔑 **Quên & Đặt lại mật khẩu**: Luồng hoàn chỉnh cho phép người dùng đặt lại mật khẩu thông qua link bảo mật được gửi tới email thật (sử dụng **Nodemailer**).
*   🛡️ **Rate Limiting**: Chống tấn công Brute Force bằng cách giới hạn số lần đăng nhập sai từ một địa chỉ IP.
*   📝 **Ghi log hoạt động**: Hệ thống tự động ghi lại các hành động quan trọng (cập nhật profile, đăng nhập...) để Admin có thể theo dõi.
*   🧠 **Quản lý trạng thái Frontend**: Sử dụng **Redux Toolkit** để quản lý trạng thái người dùng một cách tập trung và hiệu quả.
*   ⛔ **Protected Routes**: Các trang nhạy cảm (Profile, Admin Dashboard) được bảo vệ, yêu cầu người dùng phải đăng nhập và có đúng quyền hạn mới có thể truy cập.

---

## Công nghệ sử dụng

### Backend
*   **Node.js & Express.js**: Xây dựng API RESTful.
*   **MongoDB & Mongoose**: Lưu trữ và quản lý dữ liệu NoSQL.
*   **JSON Web Token (JWT)**: Xác thực người dùng với Access Token và Refresh Token.
*   **Bcrypt.js**: Mã hóa mật khẩu an toàn.
*   **Cloudinary**: Dịch vụ lưu trữ và quản lý hình ảnh.
*   **Nodemailer**: Gửi email thật cho chức năng đặt lại mật khẩu.
*   **Multer & Sharp**: Xử lý và tối ưu hóa file ảnh upload.
*   **Express Rate Limit**: Giới hạn yêu cầu truy cập.
*   **Dotenv**: Quản lý biến môi trường.

### Frontend
*   **React**: Xây dựng giao diện người dùng linh hoạt.
*   **React Router**: Điều hướng trang trong ứng dụng Single Page Application.
*   **Redux Toolkit & React-Redux**: Quản lý trạng thái toàn cục của ứng dụng.
*   **Axios**: Thực hiện các HTTP request và xử lý interceptor để tự động refresh token.
*   **CSS Modules/Styled Components**: Tạo kiểu cho giao diện (tùy chọn).

---

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu
*   Node.js (v16.x trở lên)
*   npm hoặc yarn
*   Git
*   Một tài khoản MongoDB Atlas (miễn phí)
*   Một tài khoản Cloudinary (miễn phí)
*   Một tài khoản Gmail có bật "Mật khẩu ứng dụng"

### Các bước cài đặt

1.  **Clone repository về máy:**
    ```bash
    git clone https://github.com/NguyenChiToai/group18_project.git
    cd group18_project
    ```

2.  **Cài đặt Backend:**
    *   Di chuyển vào thư mục `backend` và cài đặt các thư viện:
        ```bash
        cd backend
        npm install
        ```
    *   Tạo một file `.env` trong thư mục `backend` và điền đầy đủ các biến môi trường sau:
        ```env
        # Server & Database
        PORT=5000
        MONGO_URI=your_mongodb_atlas_connection_string

        # JWT Tokens
        JWT_SECRET=your_super_secret_key_for_access_token
        JWT_REFRESH_SECRET=your_another_super_secret_key_for_refresh_token

        # Cloudinary Credentials
        CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret

        # Nodemailer (Gmail) Credentials
        EMAIL_USER=your-email@gmail.com
        EMAIL_PASS=your_16_digit_gmail_app_password
        ```

3.  **Cài đặt Frontend:**
    *   Mở một terminal mới, từ thư mục gốc, di chuyển vào thư mục `frontend` và cài đặt:
        ```bash
        cd frontend
        npm install
        ```

### Chạy ứng dụng

Bạn cần mở 2 cửa sổ terminal riêng biệt:

1.  **Chạy Backend Server:**
    ```bash
    # Từ thư mục gốc group18-project
    cd backend
    npm start 
    # Hoặc npm run dev nếu bạn có cấu hình nodemon
    ```
    *Server sẽ chạy tại `http://localhost:5000` (hoặc port bạn đã đặt).*

2.  **Chạy Frontend Client:**
    ```bash
    # Từ thư mục gốc group18-project
    cd frontend
    npm start
    ```
    *Ứng dụng sẽ tự động mở trong trình duyệt tại `http://localhost:3000`.*
