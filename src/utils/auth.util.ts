// utils/token.utils.ts
import { generateTokens } from "./jwt.js";
import { prisma } from "../lib/prisma.js";
import crypto from "crypto";

// 토큰 저장 함수
const saveTokens = async (mb_no: number, mb_name: string) => {
  const generatedTokens = generateTokens(mb_name, mb_no);

  await prisma.tokens.upsert({
    where: { id: mb_no },
    create: {
      id: mb_no,
      userId: mb_no,
      accessToken: generatedTokens.accessToken,
      refreshToken: generatedTokens.refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    update: {
      accessToken: generatedTokens.accessToken,
      refreshToken: generatedTokens.refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
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
