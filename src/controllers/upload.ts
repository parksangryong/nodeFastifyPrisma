import { FastifyRequest, FastifyReply } from "fastify";
import { promises as fs } from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

export const uploadFile = async (
  request: FastifyRequest<{
    Body: {
      userId: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const data = await request.file();

    if (!data) {
      return reply.code(400).send({
        message: "파일이 없거나 올바른 형식이 아닙니다",
      });
    }

    const { filename, mimetype, file } = data;
    const userId = request.body.userId;

    // 파일 크기 제한 (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const chunks: Buffer[] = [];

    for await (const chunk of file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length > MAX_FILE_SIZE) {
      return reply.code(400).send({
        message: "파일 크기가 10MB를 초과합니다",
      });
    }

    // 파일 정보 로깅
    console.log("파일명:", filename);
    console.log("파일 타입:", mimetype);

    // uploads 폴더 생성 (없는 경우)
    const uploadsDir = "uploads";
    await fs.mkdir(uploadsDir, { recursive: true });

    // uploads 폴더에 파일 저장
    const uploadPath = path.join(uploadsDir, filename);

    // 이미지 파일인 경우 압축 처리
    if (mimetype.startsWith("image/")) {
      const compressedImage = await sharp(buffer)
        .resize(1200, 1200, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      await fs.writeFile(uploadPath, compressedImage);
    } else {
      await fs.writeFile(uploadPath, buffer);
    }

    // 파일 정보를 데이터베이스에 저장
    await prisma.uploads.create({
      data: {
        userId: parseInt(userId),
        fileUrl: uploadPath,
      },
    });

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
