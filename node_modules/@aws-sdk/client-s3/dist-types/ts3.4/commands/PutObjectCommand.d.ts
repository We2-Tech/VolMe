import { MetadataBearer as __MetadataBearer, StreamingBlobPayloadInputTypes } from "@smithy/types";
import { PutObjectOutput, PutObjectRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutObjectCommandInput extends Pick<
  PutObjectRequest,
  Exclude<keyof PutObjectRequest, "Body">
> {
  Body?: StreamingBlobPayloadInputTypes;
}
export interface PutObjectCommandOutput extends PutObjectOutput, __MetadataBearer {}
declare const PutObjectCommand_base: {
  new (
    input: PutObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectCommandInput,
    PutObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectCommandInput,
    PutObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutObjectCommand extends PutObjectCommand_base {
  protected static __types: {
    api: {
      input: PutObjectRequest;
      output: PutObjectOutput;
    };
    sdk: {
      input: PutObjectCommandInput;
      output: PutObjectCommandOutput;
    };
  };
}
