import { Checksum } from "@smithy/types";
export interface Crc32cNode extends Checksum {
  readonly digestLength: 4;
}
export declare const Crc32cNode: new () => Crc32cNode;
