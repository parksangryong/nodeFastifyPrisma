import { FastifyInstance } from "fastify";
import { register, login, logout, refreshTokens } from "../controllers/auth";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  password: string;
  name: string;
  email: string;
  age: number;
}

interface RefreshBody {
  refreshToken: string;
}

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: LoginBody }>("/login", async (request, reply) => {
    const { email, password } = request.body;
    const tokens = await login(email, password);

    return reply.send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });

  fastify.post<{ Body: RegisterBody }>("/register", async (request, reply) => {
    const { password, name, email, age } = request.body;
    const tokens = await register(password, name, email, age);

    return reply.send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });

  fastify.post("/logout", async (request, reply) => {
    const authHeader = request.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return reply.status(401).send({
        message: "토큰이 존재하지 않습니다.",
      });
    }
    await logout(accessToken);

    return reply.send({ message: "로그아웃에 성공했습니다." });
  });

  fastify.post<{ Body: RefreshBody }>("/refresh", async (request, reply) => {
    const { refreshToken } = request.body;

    console.log("refreshToken", refreshToken);

    if (!refreshToken) {
      return reply.status(401).send({
        code: "JWT-002",
        message: "리프레시 토큰이 필요합니다.",
      });
    }

    return await refreshTokens(refreshToken, reply);
  });
}
