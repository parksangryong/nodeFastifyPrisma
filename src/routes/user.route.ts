import { FastifyInstance } from "fastify";
import { getUsers, createUser } from "../controllers/users";

export default async function userRoutes(server: FastifyInstance) {
  server.get("/", async (request, reply) => {
    const users = await getUsers();
    return reply.send({
      message: "유저 조회 성공",
      users,
    });
  });

  server.post("/", async (request) => {
    const { email, name, age, password } = request.body as {
      name: string;
      age: number;
      email: string;
      password: string;
    };
    await createUser(email, name, age, password);
  });
}
