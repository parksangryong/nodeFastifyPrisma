### Fastify Prisma Template

This is a template for a Fastify application using Prisma.

### Getting Started

1. npx prisma init

2. schema.prisma 에 스키마 작성

3. .env 파일에 DATABASE_URL 작성

4. 선택해서 명령어 사용

- npx prisma db pull // 기존 데이터베이스 스키마 가져오기
- npx prisma migrate dev --name init // 스키마대로 새 데이터베이스 생성 및 변경
- npx prisma migrate reset // 데이터베이스 초기화
- npx prisma generate // schema.prisma 에 작성한 스키마를 바탕으로 프리즈마 클라이언트 생성
- npx prisma studio // 데이터베이스 시각화 도구 실행
- npx prisma migrate status // 마이그레이션 상태 확인
- npx prisma migrate deploy // 프로덕션 환경에서 마이그레이션 적용
- npx prisma validate // 스키마 유효성 검사
