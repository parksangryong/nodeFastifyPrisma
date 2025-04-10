import { FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { generateTokens } from "../../utils/jwt";
import { jwtDecode } from "jwt-decode";

const prisma = new PrismaClient();

export const register = async (
  password: string,
  name: string,
  email: string,
  age: number
) => {
  const user = await prisma.users.create({
    data: { password, name, email, age },
  });

  const generatedTokens = generateTokens(name, user.id);

  await prisma.tokens.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
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

export const login = async (email: string, password: string) => {
  const user = await prisma.users.findFirst({
    where: {
      AND: [{ email }, { password }],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const generatedTokens = generateTokens(user.name, user.id);

  await prisma.tokens.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
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

export const logout = async (accessToken: string) => {
  const decoded = jwtDecode(accessToken);
  const { userId } = decoded as { userId: number };

  await prisma.tokens.delete({
    where: { userId },
  });

  return { message: "로그아웃 성공" };
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const decoded = jwtDecode(refreshToken);
    const { userId, username, exp } = decoded as {
      userId: number;
      username: string;
      exp: number;
    };

    if (exp * 1000 < Date.now()) {
      throw new Error("Refresh token expired");
    }

    const storedToken = await prisma.tokens.findUnique({
      where: { userId },
    });

    if (!storedToken || storedToken.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateTokens(username, userId).accessToken;

    await prisma.tokens.update({
      where: { userId },
      data: {
        accessToken: newAccessToken,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw error; // 에러를 컨트롤러로 전달
  }
};
