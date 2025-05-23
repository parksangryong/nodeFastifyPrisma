import { FastifyInstance } from "fastify";

// service
import { register, login, logout, refreshTokens } from "./auth.service";

// schema
import {
  loginSchema,
  registerSchema,
  logoutSchema,
  refreshSchema,
} from "./auth.schema";

// types
import { LoginBody, RegisterBody, RefreshBody } from "../../types/auth.type";

// constants
import { Errors } from "../../constants/error";
import { getAccessToken } from "../../utils/jwt";

export default async function authRoutes(server: FastifyInstance) {
  server.post<{ Body: LoginBody }>("/login", {
    schema: loginSchema,
    handler: async (request, reply) => {
      const { email, password } = request.body;

      const tokens = await login({ email, password });
      reply.code(201).send({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    },
  });

  server.post<{ Body: RegisterBody }>("/register", {
    schema: registerSchema,
    handler: async (request, reply) => {
      const { password, name, email, age } = request.body;

      const tokens = await register({ password, name, email, age });

      reply.code(201).send({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    },
  });

  server.post("/logout", {
    schema: logoutSchema,
    handler: async (request, reply) => {
      const authHeader = request.headers.authorization;

      // Bearer 토큰 형식 검증
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error(Errors.JWT.TOKEN_REQUIRED.code);
      }

      // Bearer 제거하고 토큰만 추출
      const accessToken = getAccessToken(authHeader);

      if (!accessToken) {
        throw new Error(Errors.JWT.TOKEN_REQUIRED.code);
      }

      await logout(accessToken);
      reply.code(200).send({ message: "로그아웃에 성공했습니다." });
    },
  });

  server.post<{ Body: RefreshBody }>("/refresh", {
    schema: refreshSchema,
    handler: async (request, reply) => {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        throw new Error(Errors.JWT.REFRESH_TOKEN_REQUIRED.code);
      }

      const tokens = await refreshTokens(refreshToken);
      return reply.code(201).send(tokens);
    },
  });
}
