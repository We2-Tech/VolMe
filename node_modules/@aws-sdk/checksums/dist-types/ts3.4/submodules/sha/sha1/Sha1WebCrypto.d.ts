import { Checksum, SourceData } from "@smithy/types";
export declare class Sha1WebCrypto implements Checksum {
  readonly digestLength: 20;
  private readonly secret?;
  private pending;
  private pendingBytes;
  private fallback?;
  private finished;
  constructor(secret?: SourceData);
  update(data: Uint8Array): void;
  digest(): Promise<Uint8Array>;
  reset(): void;
  private switchToFallback;
}
