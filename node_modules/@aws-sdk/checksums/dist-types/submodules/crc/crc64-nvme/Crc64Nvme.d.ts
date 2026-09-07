import type { Checksum } from "@smithy/types";
/**
 * CRC-64/NVME checksum. Uses the CRT native implementation if loaded,
 * otherwise falls back to the pure JS implementation.
 *
 * @example
 * ```typescript
 * const checksum = new Crc64Nvme();
 * checksum.update(new Uint8Array([1, 2, 3]));
 * const result = await checksum.digest();
 * ```
 *
 * @public
 */
export declare class Crc64Nvme implements Checksum {
    private impl;
    constructor();
    update(data: Uint8Array): void;
    digest(): Promise<Uint8Array>;
    reset(): void;
}
