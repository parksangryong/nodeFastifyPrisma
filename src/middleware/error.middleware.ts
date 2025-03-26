import { FastifyInstance, FastifyError, FastifyReply } from "fastify";

interface CustomError extends Error {
  code?: string;
  statusCode?: number;
}

export const errorHandler = (fastify: FastifyInstance) => {
  // 전역 에러 처리
  fastify.setErrorHandler((error: FastifyError, _, reply: FastifyReply) => {
    console.error(`${error}`);

    const err = error as CustomError;
    const statusCode = err.statusCode || 500;

    return reply.status(statusCode).send({
      message: err.message,
      ...(err.code && { code: err.code }),
    });
  });

  // 404 에러 처리
  fastify.setNotFoundHandler((_, reply) => {
    return reply.status(404).send({
      message: "요청하신 경로를 찾을 수 없습니다.",
    });
  });
};
