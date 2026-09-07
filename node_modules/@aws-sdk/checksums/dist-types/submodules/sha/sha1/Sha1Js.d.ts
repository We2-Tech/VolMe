import type { Checksum, SourceData } from "@smithy/types";
/**
 * Pure JS SHA-1 implementation with HMAC support.
 * Non-destructive digest for plain hash — safe to call digest() multiple times.
 * @see https://csrc.nist.gov/pubs/fips/180-4/upd1/final
 * @public
 */
export declare class Sha1Js implements Checksum {
    readonly digestLength = 20;
    private state;
    private w?;
    private buffer;
    private bufferLength;
    private bytesHashed;
    private finished;
    private readonly inner?;
    private readonly outer?;
    constructor(secret?: SourceData);
    update(data: Uint8Array): void;
    digest(): Promise<Uint8Array>;
    reset(): void;
    private digestSync;
    private static normalizeKey;
    private hashBuffer;
    private hashBufferWith;
}
