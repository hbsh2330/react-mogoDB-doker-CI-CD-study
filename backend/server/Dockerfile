# 1. 노드 환경 설정
FROM node:18

# 2. 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# 3. 라이브러리 설치를 위해 package.json 복사
COPY package*.json ./
RUN npm install

# 4. 나머지 소스 코드 복사
COPY . .

# 5. 서버 실행
CMD ["npm", "start"]

# 6. 노드 서버 포트 개방
EXPOSE 5000