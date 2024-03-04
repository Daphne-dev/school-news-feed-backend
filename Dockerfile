# 기본 이미지
# Iron Node.js 20.11.x Bilder
FROM node:iron-alpine AS base

# pnpm 설치
RUN npm install -g pnpm

# 빌드 단계
FROM base AS builder

# 앱 디렉터리 생성
WORKDIR /build

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml ./

# 앱 의존성 설치
RUN pnpm install --frozen-lockfile

# 전체 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN pnpm run prisma:generate

# 빌드
RUN pnpm run build

# 최종 이미지
FROM base AS app

# NODE_ENV 환경변수 설정
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# 앱 디렉터리 생성
WORKDIR /app

# 의존성 파일 복사
COPY --from=builder /build/package.json /build/pnpm-lock.yaml ./

# 프로덕션 의존성만 설치
RUN pnpm install --frozen-lockfile --prod

# 빌드된 앱 및 필요한 파일들 복사
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/environments ./environments
COPY --from=builder /build/prisma ./prisma

# Prisma 클라이언트 생성
RUN pnpm run prisma:generate

ENTRYPOINT [ "node", "dist/main" ]