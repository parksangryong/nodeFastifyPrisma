// types/file.types.ts
export interface UploadResponse {
  message: string;
  fileName: string;
  path: string;
}

export interface DownloadParams {
  id: string;
}

export interface DownloadResponse {
  url: string;
}
