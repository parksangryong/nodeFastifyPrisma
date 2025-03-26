import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  email: string,
  name: string,
  age: number,
  password: string
) => {
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
