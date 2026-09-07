import { Checksum } from "@smithy/types";
export declare class Crc64Nvme implements Checksum {
  private impl;
  constructor();
  update(data: Uint8Array): void;
  digest(): Promise<Uint8Array>;
  reset(): void;
}
