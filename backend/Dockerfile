FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps for mysqlclient (switch to libpq-dev if you later choose Postgres)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential default-libmysqlclient-dev \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Safe if STATICFILES not fully configured yet
RUN python manage.py collectstatic --noinput || true

# Cloud Run listens on $PORT
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8080"]
