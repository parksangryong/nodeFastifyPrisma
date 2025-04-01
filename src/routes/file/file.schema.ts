// 업로드 스키마
export const uploadSchema = {
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        fileName: { type: "string" },
        path: { type: "string" },
        userId: { type: "number" },
      },
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

// 다운로드 스키마
export const downloadSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        url: { type: "string" },
      },
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
