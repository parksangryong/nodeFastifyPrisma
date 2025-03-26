import { FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { generateTokens } from "../utils/jwt";
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

export const refreshTokens = async (
  refreshToken: string,
  reply: FastifyReply
) => {
  try {
    const decoded = jwtDecode(refreshToken);
    const { userId, username, exp } = decoded as {
      userId: number;
      username: string;
      exp: number;
    };

    if (exp * 1000 < Date.now()) {
      console.log("리프레시 토큰 만료");
      throw new Error("Refresh token expired");
    }

    const storedToken = await prisma.tokens.findUnique({
      where: { userId },
    });

    if (!storedToken || storedToken.refreshToken !== refreshToken) {
      console.log("리프레시 토큰 유효하지 않음");
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateTokens(username, userId).accessToken;

    await prisma.tokens.update({
      where: { userId },
      data: {
        accessToken: newAccessToken,
      },
    });

    return reply.send({
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return reply.status(401).send({
      message: "유효하지 않은 리프레시 토큰입니다.",
      code: "JWT-002",
    });
  }
};
