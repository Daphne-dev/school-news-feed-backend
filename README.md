# Classting Backend 과제

클래스팅 백엔드 과제

## 구동 방법 및 확인 절차

### 1. Docker compose로 테스트 환경을 구동

```bash
docker compose up -d
```

### 2. PostgreSQL에 테스트용 스키마 생성

git clone 한 폴더에서 아래 명령어를 실행합니다.

```bash
pnpm install
pnpm run prisma:push:local
```

### 3. Api docs 확인 

```bash
http://localhost:3000/api
``` 

### 4. 확인 절차
주로 jwt가 필요한 api의 경우 회원가입 및 로그인을 통해 jwt를 획득해서 테스트 할 수 있습니다.


## 설정 파일
설정 파일은 `environments` 디렉토리 밑에서 확인할 수 있습니다.

`.env.local` 로컬에서 구동할 때 사용하는 환경설정입니다.  
`.env.dev` Docker compose로 구동할 때 사용하는 환경설정입니다.

## DB 스키마 구성
<img width="869" alt="image" src="https://github.com/Daphne-dev/school-news-feed-backend/assets/59605994/7dea870c-d4c5-4e35-9028-88e0cd0a5d95">

## 실행이 안될 때
간혹 api 컨테이너보다 redis, db 컨테이너가 늦게 시작되었을 때, api 컨테이너가 다운되어 있을 수 있습니다.  
api 컨테이너를 재실행 부탁드립니다.