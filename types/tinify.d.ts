declare module "tinify" {
  interface TinifyResult {
    toBuffer(): Promise<Buffer>;
  }

  interface TinifyModule {
    key: string;
    fromBuffer(buffer: Buffer): TinifyResult;
  }

  const tinify: TinifyModule;
  export default tinify;
}
