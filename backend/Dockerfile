FROM python:3.10-slim

WORKDIR /app

# Copy requirements và cài đặt Python packages (PyMySQL không cần build tools)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Tạo thư mục logs và cấp quyền
RUN mkdir -p /app/logs && chmod 755 /app/logs

EXPOSE 5000

CMD ["python", "app.py"]

