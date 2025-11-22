const getBlobToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Konfigurasi BLOB_READ_WRITE_TOKEN belum tersedia.");
  }
  return token;
};

export const getBlobUrl = (path: string): string => {
  const token = getBlobToken();
  return `https://vercel_blob_rw_${token}.public.blob.vercel-storage.com/${path}`;
};

export const encodeBlobPath = (objectKey: string): string => {
  return Buffer.from(objectKey, "utf8").toString("base64url");
};

export const decodeBlobPath = (id: string): string | null => {
  try {
    return Buffer.from(id, "base64url").toString("utf8");
  } catch {
    return null;
  }
};

export const getAppBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};
