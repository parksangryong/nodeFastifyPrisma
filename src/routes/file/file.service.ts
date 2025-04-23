import { FastifyRequest } from "fastify";

// libraries
import { promises as fs } from "fs";
import * as path from "path";
import sharp from "sharp";

// constants
import { Errors } from "../../constants/Error";

// prisma
import { prisma } from "../../lib/prisma";

// types
import {
  DownloadParams,
  DownloadResponse,
  UploadResponse,
} from "../../types/file.type";

// constants
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../constants/common";

export const uploadFile = async (
  request: FastifyRequest
): Promise<UploadResponse> => {
  const data = await request.file();

  if (!data) {
    throw new Error(Errors.FILE.FILE_NOT_FOUND.code);
  }

  const { filename, mimetype, file } = data;
  const userId = String(data.fields?.userId || "0");

  if (!userId || isNaN(parseInt(userId))) {
    throw new Error(Errors.FILE.INVALID_USER_ID.code);
  }

  if (!ALLOWED_IMAGE_TYPES.includes(mimetype)) {
    throw new Error(Errors.FILE.INVALID_IMAGE_TYPE.code);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of file) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(Errors.FILE.FILE_SIZE_EXCEEDED.code);
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
  request: FastifyRequest<{ Params: DownloadParams }>
): Promise<DownloadResponse> => {
  const { id } = request.params;

  const file = await prisma.uploads.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!file) {
    throw new Error(Errors.FILE.FILE_NOT_FOUND.code);
  }

  await fs.access(file.fileUrl);

  return { url: file.fileUrl };
};
