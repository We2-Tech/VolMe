import { MetadataBearer as __MetadataBearer, StreamingBlobPayloadOutputTypes } from "@smithy/types";
import { GetObjectTorrentOutput, GetObjectTorrentRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectTorrentCommandInput extends GetObjectTorrentRequest {}
export interface GetObjectTorrentCommandOutput
  extends
    Pick<GetObjectTorrentOutput, Exclude<keyof GetObjectTorrentOutput, "Body">>,
    __MetadataBearer {
  Body?: StreamingBlobPayloadOutputTypes;
}
declare const GetObjectTorrentCommand_base: {
  new (
    input: GetObjectTorrentCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectTorrentCommandInput,
    GetObjectTorrentCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectTorrentCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectTorrentCommandInput,
    GetObjectTorrentCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectTorrentCommand extends GetObjectTorrentCommand_base {
  protected static __types: {
    api: {
      input: GetObjectTorrentRequest;
      output: GetObjectTorrentOutput;
    };
    sdk: {
      input: GetObjectTorrentCommandInput;
      output: GetObjectTorrentCommandOutput;
    };
  };
}
