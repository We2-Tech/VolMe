import { MetadataBearer as __MetadataBearer, StreamingBlobPayloadOutputTypes } from "@smithy/types";
import { GetObjectOutput, GetObjectRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectCommandInput extends GetObjectRequest {}
export interface GetObjectCommandOutput
  extends Pick<GetObjectOutput, Exclude<keyof GetObjectOutput, "Body">>, __MetadataBearer {
  Body?: StreamingBlobPayloadOutputTypes;
}
declare const GetObjectCommand_base: {
  new (
    input: GetObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectCommandInput,
    GetObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectCommandInput,
    GetObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectCommand extends GetObjectCommand_base {
  protected static __types: {
    api: {
      input: GetObjectRequest;
      output: GetObjectOutput;
    };
    sdk: {
      input: GetObjectCommandInput;
      output: GetObjectCommandOutput;
    };
  };
}
