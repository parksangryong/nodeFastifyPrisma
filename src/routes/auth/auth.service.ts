// utils
import { generateTokens } from "../../utils/jwt";
import { jwtDecode } from "jwt-decode";

// constants
import { Errors } from "../../constants/error";

// prisma
import { prisma } from "../../lib/prisma";

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

  await prisma.tokens.delete({
    where: { userId },
  });

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

  const storedToken = await prisma.tokens.findUnique({
    where: { userId },
  });

  if (!storedToken || storedToken.refreshToken !== refreshToken) {
    throw new Error(Errors.JWT.INVALID_REFRESH_TOKEN.code);
  }

  const newAccessToken = generateTokens(name, userId).accessToken;

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
};
