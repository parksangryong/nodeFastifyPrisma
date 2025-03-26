import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import { verifyAccessToken } from "../utils/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticateToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const accessToken = request.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return reply.status(401).send({
      code: "JWT-003",
      message: "인증 토큰이 필요합니다.",
    });
  }

  try {
    const decoded = verifyAccessToken(accessToken);

    if (!decoded) {
      return reply.status(401).send({
        code: "JWT-001",
        message: "만료되었거나 유효하지 않은 토큰입니다.",
      });
    }

    if (typeof decoded === "string") {
      return reply.status(401).send({
        code: "JWT-001",
        message: "토큰이 유효하지 않습니다.",
      });
    }

    const storedToken = await prisma.tokens.findUnique({
      where: {
        userId: Number(decoded.userId),
      },
    });

    if (!storedToken) {
      return reply.status(401).send({
        code: "JWT-002",
        message: "데이터베이스에서 토큰을 찾을 수 없습니다.",
      });
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      return reply.status(401).send({
        code: "JWT-001",
        message: "토큰이 만료되었습니다.",
      });
    }
  } catch (error) {
    return reply.status(401).send({
      code: "JWT-001",
      message: "만료되었거나 유효하지 않은 토큰입니다.",
    });
  }
};
