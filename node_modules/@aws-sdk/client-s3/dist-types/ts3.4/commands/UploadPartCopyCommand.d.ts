import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UploadPartCopyOutput, UploadPartCopyRequest } from "../models/models_1";
export { __MetadataBearer };
export interface UploadPartCopyCommandInput extends UploadPartCopyRequest {}
export interface UploadPartCopyCommandOutput extends UploadPartCopyOutput, __MetadataBearer {}
declare const UploadPartCopyCommand_base: {
  new (
    input: UploadPartCopyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UploadPartCopyCommandInput,
    UploadPartCopyCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UploadPartCopyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UploadPartCopyCommandInput,
    UploadPartCopyCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UploadPartCopyCommand extends UploadPartCopyCommand_base {
  protected static __types: {
    api: {
      input: UploadPartCopyRequest;
      output: UploadPartCopyOutput;
    };
    sdk: {
      input: UploadPartCopyCommandInput;
      output: UploadPartCopyCommandOutput;
    };
  };
}
