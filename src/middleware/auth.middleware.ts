import type { FastifyRequest, FastifyReply } from "fastify";
import {
  verifyAccessToken,
  getAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

// prisma
import { prisma } from "../lib/prisma.js";

// constants
import { Errors } from "../constants/error.js";

interface JwtPayload {
  userId: number;
  name: string;
}

export const authenticateToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error(Errors.JWT.TOKEN_REQUIRED.code);
  }

  const accessToken = getAccessToken(authHeader);

  const decoded = verifyAccessToken(accessToken) as JwtPayload;

  const getTokenData = await prisma.tokens.findFirst({
    where: {
      accessToken: accessToken,
    },
    select: {
      refreshToken: true,
    },
  });

  if (!getTokenData) {
    throw new Error(Errors.JWT.INVALID_ACCESS_TOKEN.code);
  }

  const refreshDecoded = verifyRefreshToken(getTokenData?.refreshToken);

  console.log("ACCESS_TOKEN_SECRET:", decoded);
  console.log("REFRESH_TOKEN_DECODED:", refreshDecoded);

  if (!decoded && !refreshDecoded) {
    throw new Error(Errors.JWT.INVALID_ACCESS_TOKEN.code);
  }

  if (!decoded && refreshDecoded) {
    throw new Error(Errors.JWT.ACCESS_EXPIRED.code);
  }

  try {
    await prisma.tokens.findUnique({
      where: {
        userId: decoded.userId,
      },
    });
  } catch (error) {
    throw new Error(Errors.JWT.DB_ERROR.code);
  }
};
