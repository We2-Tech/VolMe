import type { Checksum } from "@smithy/types";
/**
 * Pure JS CRC-32C using the Castagnoli polynomial.
 * Non-destructive digest — safe to call digest() multiple times.
 * @public
 */
export declare class Crc32cJs implements Checksum {
    readonly digestLength = 4;
    private crc;
    update(data: Uint8Array): void;
    digest(): Promise<Uint8Array>;
    reset(): void;
}
