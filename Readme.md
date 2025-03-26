### Fastify Prisma Template

This is a template for a Fastify application using Prisma.

### Getting Started

0. npx prisma init // 처음에 되어있어 안해도 됨

1. schema.prisma 에 스키마 작성

2. .env 파일에 DATABASE_URL 작성

3. 선택해서 명령어 사용 (보통 스키마 생성 및 가져온 후 클라이언트 생성)

- npx prisma db pull // 기존 데이터베이스 스키마 가져오기
- npx prisma migrate dev --name init // 스키마대로 새 데이터베이스 생성 및 변경
- npx prisma migrate reset // 데이터베이스 초기화
- npx prisma generate // schema.prisma 에 작성한 스키마를 바탕으로 프리즈마 클라이언트 생성
- npx prisma studio // 데이터베이스 시각화 도구 실행
- npx prisma migrate status // 마이그레이션 상태 확인
- npx prisma migrate deploy // 프로덕션 환경에서 마이그레이션 적용
- npx prisma validate // 스키마 유효성 검사

### script 설명

```sh # 개발 모드 실행
npm run dev // 개발 모드 실행
```

```sh # 빌드 실행
npm run build // 빌드 실행
```

```sh # pm2 실행
npm run start // pm2 실행
```

```sh # pm2 중지
npm run stop // pm2 중지
```

```sh # 서버 배포
npm run deploy // 서버 배포
```

```sh # 프리즈마 클라이언트 스키마 생성
npm run db:generate // 프리즈마 클라이언트 스키마 생성
```

```sh # DB의 스키마 가져오기
npm run db:pull // DB의 스키마 가져오기
```

```sh # DB에 스키마 저장
npm run db:push // DB에 스키마 저장
```

```sh # 스키마 확인
npm run db:studio // 스키마 확인
```
