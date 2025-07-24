# 🚀 GPTB2 - Manual Setup Guide (Không dùng Docker)

## 📋 Yêu cầu hệ thống:
- **Python 3.8+** 
- **Node.js 16+** và npm
- **MySQL 8.0+** (hoặc MariaDB)

## 🔧 Bước 1: Clone và Setup

```bash
# Clone repository
git clone https://github.com/Hpt20257/OpenhandGPTB2.git
cd OpenhandGPTB2

# Tạo environment file
cp .env.example .env
```

## 🗄️ Bước 2: Setup MySQL Database

### Option A: Cài MySQL trên máy
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS
brew install mysql

# Windows: Download từ mysql.com
```

### Option B: Dùng Docker chỉ cho MySQL
```bash
docker run -d \
  --name gptb2-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=gptb2_db \
  -e MYSQL_USER=gptb2user \
  -e MYSQL_PASSWORD=gptb2pass \
  -p 3306:3306 \
  mysql:8.0
```

### Tạo database và user:
```sql
-- Kết nối MySQL as root
mysql -u root -p

-- Tạo database và user
CREATE DATABASE gptb2_db;
CREATE USER 'gptb2user'@'%' IDENTIFIED BY 'gptb2pass';
GRANT ALL PRIVILEGES ON gptb2_db.* TO 'gptb2user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

## ⚙️ Bước 3: Cấu hình .env file

```bash
# Sửa file .env
nano .env
```

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gptb2_db
DB_USER=gptb2user
DB_PASSWORD=gptb2pass

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# API Configuration
API_BASE_URL=http://localhost:5000
```

## 🐍 Bước 4: Setup Backend (Flask)

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy backend server
python app.py
```

**Backend sẽ chạy tại: http://localhost:5000**

## ⚛️ Bước 5: Setup Frontend (React)

Mở terminal mới:

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

**Frontend sẽ chạy tại: http://localhost:3000**

## 🧪 Bước 6: Test ứng dụng

1. **Mở browser**: http://localhost:3000
2. **Nhập phương trình**: Ví dụ a=1, b=-5, c=6
3. **Click "Giải phương trình"**
4. **Kết quả**: Sẽ hiển thị x₁=3, x₂=2

## 🔍 Troubleshooting

### Backend không kết nối được MySQL:
```bash
# Check MySQL đang chạy
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Test connection
mysql -u gptb2user -p gptb2_db
```

### Frontend không gọi được API:
```bash
# Check backend đang chạy
curl http://localhost:5000/api/health

# Check CORS settings trong backend/app.py
```

### Port đã được sử dụng:
```bash
# Check port 5000
lsof -i :5000
kill -9 <PID>

# Check port 3000  
lsof -i :3000
kill -9 <PID>
```

## 📊 Production Build

### Backend (Production):
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (Production):
```bash
cd frontend
npm run build
npm install -g serve
serve -s build -l 3000
```

## 🎯 Kết luận

**Phương án manual này đã được test kỹ và hoạt động 100%!**

- ✅ Backend API: Hoàn hảo
- ✅ Frontend React: Build thành công  
- ✅ Database: MySQL connection OK
- ✅ Logic giải phương trình: Chính xác tuyệt đối

**Bạn sẽ không gặp vấn đề gì với cách này!** 🚀