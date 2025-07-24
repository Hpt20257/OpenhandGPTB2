# 🧮 GPTB2 - Ứng dụng Giải Phương Trình Bậc 2

## ✅ Mô tả dự án
Ứng dụng web giải phương trình bậc 2 với giao diện React, backend Flask và database MySQL. Người dùng có thể nhập hệ số a, b, c để giải phương trình ax² + bx + c = 0, xem lịch sử các phương trình đã giải, và thực hiện các thao tác sửa/xóa.

## ✅ Công nghệ & version
- **Python**: 3.10
- **Flask**: 2.3.2
- **MySQL**: 8.0
- **React**: 18.2.0 (TypeScript)
- **Node.js**: 18.16.1
- **Docker Desktop**: >= 24.x

## ✅ Yêu cầu hệ thống
- Cần cài Docker Desktop >= 24.x
- Không cần cài thêm Python, Node.js hay bất kỳ thứ gì khác

## ✅ Cách chạy local
```bash
# Bước 1: Clone repository
git clone <repo_url>
cd GPTB2

# Bước 2: Copy file cấu hình
cp .env.example .env

# Bước 3: Khởi động toàn bộ hệ thống
docker-compose up --build
```

## ✅ Danh sách service & port
- **Frontend (React)**: http://localhost:3000
- **Backend (Flask)**: http://localhost:5000  
- **Database (MySQL)**: localhost:3306
- **Adminer (DB Admin)**: http://localhost:8080 (nếu có)

## ✅ Hướng dẫn .env
File `.env.example` chứa tất cả biến môi trường cần thiết:

```bash
# Database Configuration
DB_HOST=mysql                # Địa chỉ database (tên container)
DB_PORT=3306                 # Cổng của MySQL
DB_USER=gptb2user           # Username database
DB_PASSWORD=gptb2password   # Password database  
DB_NAME=gptb2_db            # Tên database

# Backend Configuration
SECRET_KEY=your_secret_key_change_this_in_production  # Dùng cho Flask session

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000  # URL của backend API
```

## ✅ Test nhanh
1. Truy cập http://localhost:3000 để sử dụng ứng dụng
2. Test API backend: http://localhost:5000/ping (should return {"message": "pong"})
3. Nhập hệ số a=1, b=-5, c=6 để test giải phương trình

## ✅ Phân quyền thư mục
- Backend tự động tạo thư mục `/app/logs` với quyền 755
- MySQL data được lưu trong Docker volume `mysql_data`
- Không cần tạo thêm thư mục hay cấp quyền gì

## ✅ Cách khắc phục lỗi thường gặp

### Lỗi build Docker
```bash
# Xóa cache và build lại
docker-compose down
docker system prune -f
docker-compose up --build
```

### Lỗi kết nối database
```bash
# Kiểm tra MySQL container đã chạy chưa
docker-compose ps

# Xem logs MySQL
docker-compose logs mysql

# Restart MySQL service
docker-compose restart mysql
```

### Lỗi port đã được sử dụng
```bash
# Kiểm tra port nào đang được sử dụng
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :3306

# Dừng service đang chạy hoặc thay đổi port trong docker-compose.yaml
```

### Reset toàn bộ dữ liệu
```bash
# Dừng và xóa tất cả
docker-compose down -v
docker system prune -f

# Khởi động lại
docker-compose up --build
```

## 🚀 Tính năng chính
- ✅ Giải phương trình bậc 2 với đầy đủ các trường hợp
- ✅ Lưu trữ lịch sử phương trình đã giải
- ✅ Sửa/xóa phương trình đã lưu
- ✅ Giao diện responsive, thân thiện
- ✅ API RESTful đầy đủ
- ✅ Containerized với Docker

## 📝 API Endpoints
- `GET /ping` - Health check
- `POST /api/equation` - Thêm phương trình mới
- `GET /api/equations` - Lấy danh sách phương trình
- `PUT /api/equation/<id>` - Sửa phương trình
- `DELETE /api/equation/<id>` - Xóa phương trình

## 🔧 Development
Để phát triển thêm tính năng:
1. Sửa code trong thư mục `backend/` hoặc `frontend/`
2. Restart container tương ứng: `docker-compose restart backend` hoặc `docker-compose restart frontend`
3. Hoặc rebuild toàn bộ: `docker-compose up --build`

