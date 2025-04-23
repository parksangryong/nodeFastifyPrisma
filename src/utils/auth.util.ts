// utils/token.utils.ts
import { generateTokens } from "./jwt";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

// 토큰 저장 함수
const saveTokens = async (userId: number, name: string) => {
  const generatedTokens = generateTokens(name, userId);

  await prisma.tokens.upsert({
    where: { userId },
    create: {
      userId,
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

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export { saveTokens, hashPassword, comparePassword };
