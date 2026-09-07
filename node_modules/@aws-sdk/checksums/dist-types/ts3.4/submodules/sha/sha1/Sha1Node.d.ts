import { Checksum, SourceData } from "@smithy/types";
export interface Sha1Node extends Checksum {
  readonly digestLength: 20;
}
export declare const Sha1Node: new (secret?: SourceData) => Sha1Node;
