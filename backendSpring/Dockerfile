# 1. 자바 17 환경 설정 (사용 중인 JDK 버전에 맞춤)
FROM openjdk:17-jdk-slim

# 2. 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# 3. 빌드된 JAR 파일을 컨테이너로 복사
# Gradle 빌드 시 생성되는 .jar 파일을 app.jar라는 이름으로 복사합니다.
COPY build/libs/*.jar app.jar

# 4. 서버 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

# 5. 스프링 서버 포트 개방
EXPOSE 5000