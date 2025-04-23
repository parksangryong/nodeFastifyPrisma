import { FastifyRequest, FastifyReply } from "fastify";
import { verifyAccessToken } from "../utils/jwt";

// prisma
import { prisma } from "../lib/prisma";

// constants
import { Errors } from "../constants/error";

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
    throw new Error(Errors.JWT.TOKEN_REQUIRED.code);
  }

  try {
    const decoded = verifyAccessToken(accessToken) as JwtPayload;

    console.log(decoded);

    if (!decoded) {
      throw new Error(Errors.JWT.ACCESS_EXPIRED.code);
    }

    const storedToken = await prisma.tokens.findUnique({
      where: {
        userId: decoded.userId,
      },
    });

    if (!storedToken) {
      throw new Error(Errors.JWT.REFRESH_EXPIRED.code);
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      throw new Error(Errors.JWT.ACCESS_EXPIRED.code);
    }
  } catch (error) {
    throw new Error(Errors.JWT.REFRESH_EXPIRED.code);
  }
};
