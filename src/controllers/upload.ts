import { FastifyRequest, FastifyReply } from "fastify";
import { promises as fs } from "fs";
import * as fsSync from "fs"; // createWriteStream용
import * as path from "path";
import { pipeline } from "stream/promises";

interface MultipartFile {
  filename: string;
  encoding: string;
  mimetype: string;
  file: NodeJS.ReadableStream;
}

export const uploadFile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = await request.file();

    if (!data) {
      return reply.code(400).send({
        message: "파일이 없거나 올바른 형식이 아닙니다",
        received: "no file field",
      });
    }

    const { filename, mimetype, file } = data;

    // 파일 정보 로깅
    console.log("파일명:", filename);
    console.log("파일 타입:", mimetype);

    // uploads 폴더 생성 (없는 경우)
    const uploadsDir = "uploads";
    await fs.mkdir(uploadsDir, { recursive: true });

    // uploads 폴더에 파일 저장
    const uploadPath = path.join(uploadsDir, filename);

    // 스트림을 사용하여 파일 저장
    await pipeline(file, fsSync.createWriteStream(uploadPath));

    return reply.send({
      message: "파일 업로드 성공",
      fileName: filename,
      path: uploadPath,
    });
  } catch (error) {
    console.error("파일 업로드 에러:", error);
    return reply.code(500).send({
      message: "파일 업로드 실패",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
