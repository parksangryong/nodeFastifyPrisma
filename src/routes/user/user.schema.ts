// 업로드 스키마
export const getUsersSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        users: { type: "array" },
      },
    },
  },
};

export const createUserSchema = {
  body: {
    type: "object",
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
      properties: {
        message: { type: "string" },
      },
    },
  },
};
