import { FastifyInstance, FastifyRequest } from "fastify";
import { uploadFile, downloadFile } from "./file.service";
import { uploadSchema, downloadSchema } from "./file.schema";

export default async function filesRoutes(server: FastifyInstance) {
  server.post("/upload", {
    schema: uploadSchema,
    handler: async (
      request: FastifyRequest<{ Body: { userId: string } }>,
      reply
    ) => {
      const result = await uploadFile(request);
      return reply.code(201).send(result);
    },
  });

  server.get("/download/:id", {
    schema: downloadSchema,
    handler: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply
    ) => {
      const result = await downloadFile(request);
      return reply.code(200).send(result);
    },
  });
}
