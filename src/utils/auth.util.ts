// utils/token.utils.ts
import { generateTokens } from "./jwt.js";
import { redis } from "../lib/redis.js";
import crypto from "crypto";

// constants
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from "../constants/common.js";

// 토큰 저장 함수
const saveTokens = async (userId: number, name: string) => {
  const generatedTokens = generateTokens(name, userId);

  // Redis에 토큰 저장 (14일 유효기간)
  await redis.set(`access_token:${userId}`, generatedTokens.accessToken, {
    EX: ACCESS_TOKEN_EXPIRATION_TIME * 60, // 30분
  });
  await redis.set(`refresh_token:${userId}`, generatedTokens.refreshToken, {
    EX: REFRESH_TOKEN_EXPIRATION_TIME * 24 * 60 * 60, // 14일
  });

  return generatedTokens;
};

// 암호화 방법은 알아서 결정(임의)
const hashPassword = (password: string): string => {
  const firstSha1 = crypto.createHash("sha1").update(password).digest();
  const secondSha1 = crypto.createHash("sha1").update(firstSha1).digest("hex");
  return `*${secondSha1.toUpperCase()}`;
};

const comparePassword = (
  plainPassword: string,
  hashedPassword: string
): boolean => {
  const hashedInput = hashPassword(plainPassword);
  return hashedInput === hashedPassword;
};

export { saveTokens, hashPassword, comparePassword };
