// utils
import { generateTokens } from "../../utils/jwt";
import { jwtDecode } from "jwt-decode";

// constants
import { Errors } from "../../constants/error";

// prisma
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";

// types
import { RegisterBody, LoginBody, TokenResponse } from "../../types/auth.type";

// utils
import {
  saveTokens,
  hashPassword,
  comparePassword,
} from "../../utils/auth.util";

export const register = async (body: RegisterBody): Promise<TokenResponse> => {
  const existingUser = await prisma.users.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new Error(Errors.AUTH.USER_EXISTS.code);
  }

  const hashedPassword = await hashPassword(body.password);

  const user = await prisma.users.create({
    data: {
      password: hashedPassword,
      name: body.name,
      email: body.email,
      age: body.age,
    },
  });

  return await saveTokens(user.id, user.name);
};

export const login = async (body: LoginBody): Promise<TokenResponse> => {
  const user = await prisma.users.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    throw new Error(Errors.AUTH.USER_NOT_FOUND.code);
  }

  const isPasswordValid = await comparePassword(body.password, user.password);
  if (!isPasswordValid) {
    throw new Error(Errors.AUTH.PASSWORD_NOT_MATCH.code);
  }

  return await saveTokens(user.id, user.name);
};

export const logout = async (
  accessToken: string
): Promise<{ message: string }> => {
  const decoded = jwtDecode(accessToken);
  const { userId } = decoded as { userId: number };

  console.log("userId:", userId);

  // Redis에서 토큰 삭제
  await redis.del(`access_token:${userId}`);
  await redis.del(`refresh_token:${userId}`);

  return { message: "로그아웃 성공" };
};

export const refreshTokens = async (
  refreshToken: string
): Promise<TokenResponse> => {
  const decoded = jwtDecode(refreshToken);
  const { userId, name, exp } = decoded as {
    userId: number;
    name: string;
    exp: number;
  };

  if (!userId || !name) {
    throw new Error(Errors.JWT.INVALID_REFRESH_TOKEN.code);
  }

  if (exp * 1000 < Date.now()) {
    throw new Error(Errors.JWT.REFRESH_EXPIRED.code);
  }

  // Redis에서 저장된 리프레시 토큰 확인
  const storedRefreshToken = await redis.get(`refresh_token:${userId}`);
  if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    throw new Error(Errors.JWT.INVALID_REFRESH_TOKEN.code);
  }

  const newAccessToken = generateTokens(name, userId).accessToken;

  // Redis에 새로운 액세스 토큰 저장
  await redis.set(`access_token:${userId}`, newAccessToken, {
    EX: 1800, // 30분
  });

  return {
    accessToken: newAccessToken,
    refreshToken: refreshToken,
  };
};
