FROM python:3.11

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 설치 (supervisord 포함)
RUN apt-get update && apt-get install -y supervisor

# 필요한 파일 복사
COPY requirements.txt /app/

# 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 나머지 파일 복사
COPY . /app/

# supervisord 설정 파일 복사
COPY supervisord.conf /etc/supervisord.conf

# Flask 앱 실행
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
