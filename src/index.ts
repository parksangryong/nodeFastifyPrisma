import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import userRoutes from "./routes/user.route";
import multipart from "@fastify/multipart";

import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.route";
import uploadRoutes from "./routes/upload.route";

import { errorHandler } from "./middleware/error.middleware";
import { authenticateToken } from "./middleware/auth.middleware";
const prisma = new PrismaClient();

const app = Fastify({
  logger: true, // 기본 로거 설정으로 변경
});

errorHandler(app);

// 미들웨어 등록
app.register(multipart); // 파일 업로드 지원
app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Authorization", "Content-Type"],
}); // CORS 활성화
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
}); // 요청 제한

// 라우터 등록
app.register(authRoutes, { prefix: "/auth" });
app.register(async function authenticatedRoutes(fastify) {
  // 인증이 필요한 라우트들에 미들웨어 적용
  fastify.addHook("preHandler", authenticateToken);

  fastify.register(userRoutes, { prefix: "/users" });
  fastify.register(uploadRoutes, { prefix: "/uploads" });
});

// Prisma DB 연결 테스트
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// 서버 시작
const start = async () => {
  try {
    await testConnection(); // Prisma DB 연결 테스트
    const PORT = process.env.PORT || 3000;
    await app.listen({
      port: Number(PORT),
      host: "0.0.0.0", // 모든 네트워크 인터페이스에서 리스닝
    });
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
