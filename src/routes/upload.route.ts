import { FastifyInstance } from "fastify";
import { uploadFile } from "../controllers/upload";

export default async function uploadRoutes(server: FastifyInstance) {
  server.post("/", uploadFile);
}
