import { FastifyRequest } from "fastify";
import { promises as fs } from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/jpg",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/ico",
];

export const uploadFile = async (
  request: FastifyRequest<{
    Body: {
      userId: string;
    };
  }>
) => {
  const data = await request.file();

  if (!data) {
    throw new Error("파일이 없거나 올바른 형식이 아닙니다");
  }

  const { filename, mimetype, file } = data;
  const userId = request.body.userId;

  if (!ALLOWED_IMAGE_TYPES.includes(mimetype)) {
    throw new Error("지원되지 않는 이미지 형식입니다");
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const chunks: Buffer[] = [];

  for await (const chunk of file) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error("파일 크기가 10MB를 초과합니다");
  }

  const sanitizedFileName = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  const uploadsDir = "uploads";
  await fs.mkdir(uploadsDir, { recursive: true });
  const uploadPath = path.join(uploadsDir, sanitizedFileName);

  const compressedImage = await sharp(buffer)
    .resize(1200, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  await fs.writeFile(uploadPath, compressedImage);

  await prisma.uploads.create({
    data: {
      userId: parseInt(userId),
      fileUrl: uploadPath,
      fileName: sanitizedFileName,
      fileType: mimetype,
      fileSize: buffer.length,
    },
  });

  return {
    message: "파일 업로드 성공",
    fileName: filename,
    path: uploadPath,
  };
};

export const downloadFile = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>
) => {
  const { id } = request.params;

  const file = await prisma.uploads.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!file) {
    throw new Error("파일을 찾을 수 없습니다");
  }

  try {
    await fs.access(file.fileUrl);
  } catch {
    throw new Error("파일이 서버에 존재하지 않습니다");
  }

  return { url: file.fileUrl };
};
