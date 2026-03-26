# 🚀 Full-Stack Inventory Management Project
> **React, Spring Boot, Node.js, MongoDB를 활용한 도커 기반 CI/CD 배포 연습**

One Frontend, Dual Engines" – 동일한 UI 환경에서 Java/Spring과 Node.js 백엔드를 교체하며 구동하는 컨테이너 기반 프로젝트

본 프로젝트는 동일한 React 프론트엔드와 MongoDB 데이터베이스를 공유하면서, 백엔드 엔진만 Java/Spring Boot와 Node.js/Express로 상호 교체하며 운영할 수 있는 가용성 높은 환경 구축에 중점을 두었습니다.

---

## 1. 🛠 기술 스택 (Tech Stack)

| 분류 | 기술 |
| :--- | :--- |
| **Frontend** | React (Vite), Axios, Tailwind CSS |
| **Backend (Java)** | Spring Boot 3.x, Spring Security, JWT |
| **Backend (JS)** | Node.js, Express, Mongoose |
| **Database** | MongoDB (NoSQL) |
| **DevOps** | Docker, Docker Compose, GitHub Actions, AWS EC2 |

---

## 2. 🚢 도커 & CI/CD (Docker & Deployment)

단순히 코드를 작성하는 것을 넘어, **"어디서든 동일하게 실행되는 환경"**을 구축하는 데 집중했습니다.

* **Dockerizing**: Frontend, Backend(Spring/Node), Database를 각각 독립된 컨테이너로 분리하여 관리.
* **Docker Compose**: `docker-compose.yml`을 통해 다중 컨테이너 서비스를 하나의 명령어로 제어.
* **CI/CD Pipeline**: 
    * GitHub `push` 시 **GitHub Actions** 자동 트리거.
    * Docker Hub를 통한 이미지 빌드 및 푸시 자동화.
    * 운영 서버(AWS EC2)에서 최신 이미지 `pull` 및 무중단 배포 환경 구성.



---

## 📅 개발 기간 (Development Period)

* **전체 기간**: 2026.03.13 ~ 2026.03.25 (약 2주일)
* **주요 마일스톤**:
    * **1~5일차**: React 프론트엔드 설계 및 기본 UI 구현
    * **5~10일차**: Spring Boot & Node.js API 설계 및 MongoDB 데이터 연동
    * **10~12일차**: Docker Compose 설정 및 GitHub Actions 배포 자동화 구축
    * **마지막 날**: CORS 보안 설정 최적화 및 서버 포트 충돌 이슈 해결

---

## 📝 느낀 점 (Retrospective)

**RDBMS에서 NoSQL(MongoDB)로 :** 기존 `Java Spring` 및 `RDBMS(Oracle/MySQL)` 기반 개발 환경에서 벗어나, `React`와 `MongoDB(NoSQL)` 조합을 통한 데이터 모델링의 유연성 확보.

**Schema-less 구조의 이해 및 적용:** 고정된 테이블 구조가 아닌 `JSON` 형태의 도큐먼트 구조를 다루며, 요구사항 변화에 유연하게 대응 가능한 `NoSQL` 설계 역량 강화.

**컨테이너 기반 환경 구축:** 도커를 통한 애플리케이션 컨테이너화로 환경 격리의 중요성 파악 및 `docker-compose`를 활용한 DB, WAS, Web 서버의 통합 오케스트레이션 관리.

**e학습터 프로젝트의 연장선:** 과거 대규모 프로젝트에서 논의되었던 인프라 유연성에 대한 갈증을, 직접 '스택 교체형 아키텍처'를 설계하고 배포하며 실무적 지식으로 승화.

---

## 🧭 향후 목표: Cloud Native로 수정

컨테이너 기술의 기초를 다진 경험을 바탕으로, 다중 컨테이너의 효율적 관리와 무중단 서비스를 위한 쿠버네티스(Kubernetes) 도입 및 학습 예정.

## 📂 프로젝트 실행 방법 (Quick Start)

```bash
# 저장소 클론
git clone [https://github.com/사용자계정/리포지토리명.git](https://github.com/사용자계정/리포지토리명.git)

# 도커 컴포즈 실행
docker-compose up -d
