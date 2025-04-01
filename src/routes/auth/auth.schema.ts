// 로그인 스키마
export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 3 },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
  },
};

// 회원가입 스키마
export const registerSchema = {
  body: {
    type: "object",
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
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
  },
};

// 로그아웃 스키마
export const logoutSchema = {
  body: {},
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

// 리프레시 토큰 스키마
export const refreshSchema = {
  body: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
  },
};
