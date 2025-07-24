FROM python:3.10

WORKDIR /app

# Cài đặt các dependencies cần thiết cho MySQL
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements và cài đặt Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Tạo thư mục logs và cấp quyền
RUN mkdir -p /app/logs && chmod 755 /app/logs

EXPOSE 5000

CMD ["python", "app.py"]

