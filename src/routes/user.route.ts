import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { getUsers, createUser } from "../controllers/users";
const prisma = new PrismaClient();

export default async function userRoutes(server: FastifyInstance) {
  server.get("/", getUsers);

  server.post("/", async (request) => {
    const { email, name, age, password } = request.body as {
      name: string;
      age: number;
      email: string;
      password: string;
    };
    return await createUser(email, name, age, password);
  });
}
