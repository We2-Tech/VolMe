import type { Checksum } from "@smithy/types";
/**
 * CRC-32C (Castagnoli). No native Node.js implementation exists,
 * so this is equivalent to the pure JS version.
 * @public
 */
export interface Crc32cNode extends Checksum {
    readonly digestLength: 4;
}
/**
 * @public
 */
export declare const Crc32cNode: new () => Crc32cNode;
