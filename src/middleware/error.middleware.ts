import { FastifyInstance, FastifyError, FastifyReply } from "fastify";
import { Errors } from "../constants/error";

interface CustomError extends Error {
  code?: string;
  statusCode?: number;
}

export const errorHandler = (fastify: FastifyInstance) => {
  // 전역 에러 처리
  fastify.setErrorHandler((error: FastifyError, _, reply: FastifyReply) => {
    console.error(`${error}`);

    if (error.validation) {
      return reply.status(410).send({
        message: "유효하지 않은 요청입니다",
        code: "VALIDATION_ERROR",
        issues: error.validation.map((v) => v.message),
      });
    }

    // 모든 에러 객체를 평탄화하여 검색
    const errorEntries = Object.values(Errors).flatMap((category) =>
      Object.values(category)
    );

    const matchedError = errorEntries.find((err) => err.code === error.message);

    if (matchedError) {
      return reply.status(matchedError.status).send({
        message: matchedError.message,
        code: matchedError.code,
      });
    }

    // 기본 에러 응답
    return reply.status(500).send({
      message: "서버 에러가 발생했습니다",
      code: "SERVER_ERROR",
    });
  });

  // 404 에러 처리
  fastify.setNotFoundHandler((_, reply) => {
    return reply.status(404).send({
      message: "요청하신 경로를 찾을 수 없습니다.",
    });
  });
};
