// 로그인 스키마
export const loginSchema = {
  tags: ["auth"],
  body: {
    type: "object",
    description: "이메일과 비밀번호를 입력하여 로그인합니다.",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 3 },
    },
  },
  response: {
    201: {
      type: "object",
      description: "로그인 성공 시 토큰을 반환합니다.",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
    401: {
      type: "object",
      description: "로그인 실패 시 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};

// 회원가입 스키마
export const registerSchema = {
  tags: ["auth"],
  body: {
    type: "object",
    description: "이메일, 비밀번호, 이름, 나이를 입력하여 회원가입합니다.",
    required: ["email", "password", "name", "age"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      name: { type: "string", minLength: 1 },
      age: { type: "number", minimum: 1 },
    },
  },
  response: {
    201: {
      type: "object",
      description: "회원가입 성공 시 토큰을 반환합니다.",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
    400: {
      type: "object",
      description: "회원가입 실패 시 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
    409: {
      type: "object",
      description: "이미 존재하는 이메일 시 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};

// 로그아웃 스키마
export const logoutSchema = {
  tags: ["auth"],
  description: "헤더의 액세스 토큰을 사용하여 로그아웃합니다.",
  response: {
    200: {
      type: "object",
      description: "로그아웃 성공 시 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
      },
    },
    401: {
      type: "object",
      description: "로그아웃 실패 시 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};

// 리프레시 토큰 스키마
export const refreshSchema = {
  tags: ["auth"],
  body: {
    type: "object",
    description: "리프레시 토큰을 입력하여 새로운 액세스 토큰을 발급합니다.",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
    },
  },
  response: {
    201: {
      type: "object",
      description: "새로운 액세스 토큰을 발급합니다.",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
    401: {
      type: "object",
      description: "토큰 발급 실패 시 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};
