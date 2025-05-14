// 업로드 스키마
export const getUsersSchema = {
  tags: ["user"],
  description: "유저 목록을 조회합니다.",
  response: {
    200: {
      type: "object",
      description: "유저 조회 성공 시 메시지와 유저 목록을 반환합니다.",
      properties: {
        message: { type: "string" },
        users: { type: "array" },
      },
    },
    401: {
      type: "object",
      description: "유저 조회 실패 시 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};

export const createUserSchema = {
  tags: ["user"],
  body: {
    type: "object",
    description: "이메일, 이름, 나이, 비밀번호를 입력하여 유저를 생성합니다.",
    required: ["email", "name", "age", "password"],
    properties: {
      email: { type: "string", format: "email" },
      name: { type: "string" },
      age: { type: "number" },
      password: { type: "string", minLength: 8 },
    },
  },
  response: {
    201: {
      type: "object",
      description: "유저 생성 성공 시 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
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
