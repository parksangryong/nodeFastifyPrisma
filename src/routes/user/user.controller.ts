import { FastifyInstance, FastifyRequest } from "fastify";
import { getUsers, createUser } from "./user.service";
import { getUsersSchema, createUserSchema } from "./user.schema";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateUserBody = {
  email: string;
  name: string;
  age: number;
  password: string;
};

export default async function userRoutes(server: FastifyInstance) {
  server.get("/", {
    schema: getUsersSchema,
    handler: async (request, reply) => {
      try {
        const users = await getUsers();
        return reply.code(200).send({
          message: "유저 조회 성공",
          users,
        });
      } catch (error) {
        throw new Error("USER-002");
      }
    },
  });

  server.post("/", {
    schema: createUserSchema,
    handler: async (
      request: FastifyRequest<{ Body: CreateUserBody }>,
      reply
    ) => {
      const { email, name, age, password } = request.body;

      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log("이미 존재하는 이메일입니다");
        throw new Error("USER-003");
      }

      try {
        await createUser(email, name, age, password);
        return reply.code(201).send({
          message: "유저 생성 성공",
        });
      } catch (error) {
        throw new Error("USER-001");
      }
    },
  });
}
