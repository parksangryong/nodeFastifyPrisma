import { FastifyInstance } from "fastify";
import { uploadFile } from "../controllers/upload";
import { downloadFile } from "../controllers/download";

export default async function filesRoutes(server: FastifyInstance) {
  server.post("/upload", uploadFile);

  server.get("/download/:id", downloadFile);
}
