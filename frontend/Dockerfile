# 1. 노드 환경 설정
FROM node:22

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 라이브러리 설치
COPY package*.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 반드시 대괄호 [ ] 안에 쉼표(,)로 구분해서 넣으세요.
CMD ["npm", "run", "dev", "--", "--host"]

# 포트 번호도 Vite 기본값인 5173으로 맞춰주는 게 좋습니다.
EXPOSE 5173