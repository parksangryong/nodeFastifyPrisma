// constants/errors.ts
export const Errors = {
  AUTH: {
    PASSWORD_NOT_MATCH: {
      code: "AUTH-001",
      status: 401,
      message: "비밀번호가 일치하지 않습니다",
    },
    USER_NOT_FOUND: {
      code: "AUTH-002",
      status: 404,
      message: "존재하지 않는 유저입니다",
    },
    USER_EXISTS: {
      code: "AUTH-003",
      status: 409,
      message: "이미 존재하는 유저입니다",
    },
    CREATE_FAILED: {
      code: "AUTH-004",
      status: 400,
      message: "유저 생성에 실패했습니다",
    },
  },
  USER: {
    CREATE_FAILED: {
      code: "USER-001",
      status: 400,
      message: "유저 생성 실패",
    },
    READ_FAILED: {
      code: "USER-002",
      status: 400,
      message: "유저 조회 실패",
    },
    EMAIL_EXISTS: {
      code: "USER-003",
      status: 409,
      message: "이미 존재하는 이메일입니다",
    },
  },
  JWT: {
    ACCESS_EXPIRED: {
      code: "JWT-001",
      status: 401,
      message: "액세스 토큰이 만료되었습니다",
    },
    REFRESH_EXPIRED: {
      code: "JWT-002",
      status: 401,
      message: "리프레시 토큰이 만료되었습니다",
    },
    TOKEN_REQUIRED: {
      code: "JWT-003",
      status: 401,
      message: "인증 토큰이 필요합니다",
    },
    INVALID_REFRESH_TOKEN: {
      code: "JWT-004",
      status: 401,
      message: "유효하지 않은 리프레시 토큰입니다",
    },
  },
} as const;
