export const getBlobUrl = (path: string): string => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  }
  return `https://vercel_blob_rw_${process.env.BLOB_READ_WRITE_TOKEN}.public.blob.vercel-storage.com/${path}`;
};
