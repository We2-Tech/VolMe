import type { Checksum, SourceData } from "@smithy/types";
/**
 * SHA-1 using the Web Crypto API (crypto.subtle) when available,
 * falling back to the pure JS implementation.
 *
 * Caution: buffers data entirely in memory since WebCrypto requires
 * all data at once for digest().
 * @public
 */
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
