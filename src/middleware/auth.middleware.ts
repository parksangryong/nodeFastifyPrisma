import type { FastifyRequest, FastifyReply } from "fastify";
import {
  verifyAccessToken,
  getAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

// redis
import { redis } from "../lib/redis.js";

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

  if (!decoded) {
    throw new Error(Errors.JWT.ACCESS_EXPIRED.code);
  }
};
