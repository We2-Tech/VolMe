import type { Checksum } from "@smithy/types";
/**
 * Pure JS CRC-64/NVME implementation using the NVMe polynomial (0x9a6c9329ac4bc9b5).
 * Uses an 8-slice lookup table for efficient computation.
 * @public
 */
export declare class Crc64NvmeJs implements Checksum {
    private c1;
    private c2;
    constructor();
    update(data: Uint8Array): void;
    digest(): Promise<Uint8Array>;
    reset(): void;
}
