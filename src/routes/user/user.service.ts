// constants
import { Errors } from "../../constants/error";

// prisma
import { prisma } from "../../lib/prisma";

export const createUser = async (
  email: string,
  name: string,
  age: number,
  password: string
) => {
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error(Errors.USER.USER_NOT_FOUND.code);
  }

  return await prisma.users.create({
    data: {
      name,
      age,
      email,
      password,
    },
  });
};

export const getUsers = async () => {
  return await prisma.users.findMany();
};
