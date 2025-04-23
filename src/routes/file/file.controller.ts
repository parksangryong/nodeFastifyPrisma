import { FastifyInstance } from "fastify";

// service
import { uploadFile, downloadFile } from "./file.service";

// schema
import { uploadSchema, downloadSchema } from "./file.schema";
import {
  DownloadParams,
  DownloadResponse,
  UploadResponse,
} from "../../types/file.type";

export default async function filesRoutes(server: FastifyInstance) {
  server.post<{ Reply: UploadResponse }>("/upload", {
    schema: uploadSchema,
    handler: async (request, reply) => {
      const result = await uploadFile(request);
      return reply.code(201).send(result);
    },
  });

  server.get<{ Params: DownloadParams; Reply: DownloadResponse }>(
    "/download/:id",
    {
      schema: downloadSchema,
      handler: async (request, reply) => {
        const result = await downloadFile(request);
        return reply.code(200).send(result);
      },
    }
  );
}
