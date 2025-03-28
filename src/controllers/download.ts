import { FastifyRequest, FastifyReply } from "fastify";
import { promises as fs } from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const downloadFile = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;

    const file = await prisma.uploads.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!file) {
      return reply.code(404).send({
        message: "파일을 찾을 수 없습니다",
      });
    }

    // 파일 시스템에서 파일 존재 확인
    try {
      await fs.access(file.fileUrl);
    } catch {
      return reply.code(404).send({
        message: "파일이 서버에 존재하지 않습니다",
      });
    }

    return reply.send({
      url: file.fileUrl,
    });
  } catch (error) {
    console.error("파일 다운로드 에러:", error);
    return reply.code(500).send({
      message: "파일 다운로드 실패",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
