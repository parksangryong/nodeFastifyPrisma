import { FastifyInstance } from "fastify";
import { register, login, logout, refreshTokens } from "./auth.service";
import {
  loginSchema,
  registerSchema,
  logoutSchema,
  refreshSchema,
} from "./auth.schema";

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

export default async function authRoutes(server: FastifyInstance) {
  server.post<{ Body: LoginBody }>("/login", {
    schema: loginSchema,
    handler: async (request, reply) => {
      const { email, password } = request.body;
      const tokens = await login(email, password);

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
      const tokens = await register(password, name, email, age);

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
      const accessToken = authHeader?.split(" ")[1];

      if (!accessToken) {
        return reply.status(401).send({
          code: "JWT-002",
          message: "토큰이 존재하지 않습니다.",
        });
      }
      await logout(accessToken);

      reply.code(200).send({ message: "로그아웃에 성공했습니다." });
    },
  });

  server.post<{ Body: RefreshBody }>("/refresh", {
    schema: refreshSchema,
    handler: async (request, reply) => {
      try {
        const { refreshToken } = request.body;

        if (!refreshToken) {
          return reply.status(401).send({
            code: "JWT-002",
            message: "리프레시 토큰이 필요합니다.",
          });
        }

        const tokens = await refreshTokens(refreshToken);
        return reply.code(201).send(tokens);
      } catch (error) {
        return reply.status(401).send({
          message: "유효하지 않은 리프레시 토큰입니다.",
          code: "JWT-002",
        });
      }
    },
  });
}
