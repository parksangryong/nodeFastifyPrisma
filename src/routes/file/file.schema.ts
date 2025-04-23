// 업로드 스키마
export const uploadSchema = {
  description:
    "FormData 형식으로 이미지 파일을 업로드합니다. FormData에는 userId가 포함되어야 합니다.",
  tags: ["file"],
  response: {
    201: {
      type: "object",
      description: "이미지 업로드 성공 시 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        fileName: { type: "string" },
        path: { type: "string" },
        userId: { type: "number" },
      },
    },
    400: {
      type: "object",
      description: "이미지 업로드 실패 시 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
    404: {
      type: "object",
      description:
        "이미지 파일이 없거나 유효하지 않은 경우 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};

// 다운로드 스키마
export const downloadSchema = {
  tags: ["file"],
  params: {
    type: "object",
    description: "이미지 파일의 ID를 입력하여 다운로드합니다.",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      description: "이미지 파일을 다운로드합니다.",
      properties: {
        url: { type: "string" },
      },
    },
    404: {
      type: "object",
      description: "이미지 파일이 존재하지 않는 경우 오류 메시지를 반환합니다.",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};
