import { MetadataBearer as __MetadataBearer, StreamingBlobPayloadInputTypes } from "@smithy/types";
import { UploadPartOutput, UploadPartRequest } from "../models/models_1";
export { __MetadataBearer };
export interface UploadPartCommandInput extends Pick<
  UploadPartRequest,
  Exclude<keyof UploadPartRequest, "Body">
> {
  Body?: StreamingBlobPayloadInputTypes;
}
export interface UploadPartCommandOutput extends UploadPartOutput, __MetadataBearer {}
declare const UploadPartCommand_base: {
  new (
    input: UploadPartCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UploadPartCommandInput,
    UploadPartCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UploadPartCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UploadPartCommandInput,
    UploadPartCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UploadPartCommand extends UploadPartCommand_base {
  protected static __types: {
    api: {
      input: UploadPartRequest;
      output: UploadPartOutput;
    };
    sdk: {
      input: UploadPartCommandInput;
      output: UploadPartCommandOutput;
    };
  };
}
