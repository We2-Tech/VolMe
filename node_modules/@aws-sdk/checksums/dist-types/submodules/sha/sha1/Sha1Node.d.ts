import type { Checksum, SourceData } from "@smithy/types";
/**
 * SHA-1 using Node.js crypto native implementation when available,
 * falling back to the pure JS implementation.
 * @public
 */
export interface Sha1Node extends Checksum {
    readonly digestLength: 20;
}
/**
 * @public
 */
export declare const Sha1Node: new (secret?: SourceData) => Sha1Node;
