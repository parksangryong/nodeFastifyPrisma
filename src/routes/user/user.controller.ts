import { FastifyInstance, FastifyRequest } from "fastify";
import { getUsers, createUser } from "./user.service";
import { getUsersSchema, createUserSchema } from "./user.schema";

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
      const users = await getUsers();
      return reply.code(200).send({
        message: "유저 조회 성공",
        users,
      });
    },
  });

  server.post("/", {
    schema: createUserSchema,
    handler: async (
      request: FastifyRequest<{ Body: CreateUserBody }>,
      reply
    ) => {
      const { email, name, age, password } = request.body;
      await createUser(email, name, age, password);
      return reply.code(200).send({ message: "유저 생성 성공" });
    },
  });
}
