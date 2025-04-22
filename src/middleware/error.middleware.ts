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
    let statusCode = 500;
    let message = "서버 에러가 발생했습니다";

    if (error.validation) {
      return reply.status(400).send({
        message: "유효성 검사 실패",
        errors: error.validation.map((v) => v.message),
      });
    }

    // 에러 코드에 따른 상태 코드 설정
    switch (err.message) {
      case "USER-001":
        statusCode = 400;
        message = "유저 생성 실패";
        break;
      case "USER-002":
        statusCode = 400;
        message = "유저 조회 실패";
        break;
      case "USER-003":
        statusCode = 409;
        message = "이미 존재하는 이메일입니다";
        break;
    }

    return reply.status(statusCode).send({
      message,
      code: err.message,
    });
  });

  // 404 에러 처리
  fastify.setNotFoundHandler((_, reply) => {
    return reply.status(404).send({
      message: "요청하신 경로를 찾을 수 없습니다.",
    });
  });
};
