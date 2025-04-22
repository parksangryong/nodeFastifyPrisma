import { FastifyRequest, FastifyReply } from "fastify";
import { verifyAccessToken } from "../utils/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface JwtPayload {
  userId: number;
  username: string;
}

export const authenticateToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const accessToken = request.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    throw new Error("JWT-003");
  }

  try {
    const decoded = verifyAccessToken(accessToken) as JwtPayload;

    console.log(decoded);

    if (!decoded) {
      throw new Error("JWT-001");
    }

    const storedToken = await prisma.tokens.findUnique({
      where: {
        userId: decoded.userId,
      },
    });

    if (!storedToken) {
      throw new Error("JWT-002");
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      throw new Error("JWT-001");
    }
  } catch (error) {
    throw new Error("JWT-001");
  }
};
