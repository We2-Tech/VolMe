import { Checksum } from "@smithy/types";
export declare class Crc32cJs implements Checksum {
  readonly digestLength = 4;
  private crc;
  update(data: Uint8Array): void;
  digest(): Promise<Uint8Array>;
  reset(): void;
}
