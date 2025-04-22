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
        throw new Error("JWT-002");
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
        throw new Error("JWT-002");
      }

      try {
        const tokens = await refreshTokens(refreshToken);
        return reply.code(201).send(tokens);
      } catch (error) {
        throw new Error("JWT-002");
      }
    },
  });
}
