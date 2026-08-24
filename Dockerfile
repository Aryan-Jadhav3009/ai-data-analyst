FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements-docker.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch==2.13.0 \
    && pip install --no-cache-dir -r requirements-docker.txt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["./entrypoint.sh"]