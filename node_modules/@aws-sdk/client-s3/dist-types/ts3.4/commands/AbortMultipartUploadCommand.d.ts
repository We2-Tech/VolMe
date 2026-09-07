import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { AbortMultipartUploadOutput, AbortMultipartUploadRequest } from "../models/models_0";
export { __MetadataBearer };
export interface AbortMultipartUploadCommandInput extends AbortMultipartUploadRequest {}
export interface AbortMultipartUploadCommandOutput
  extends AbortMultipartUploadOutput, __MetadataBearer {}
declare const AbortMultipartUploadCommand_base: {
  new (
    input: AbortMultipartUploadCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    AbortMultipartUploadCommandInput,
    AbortMultipartUploadCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: AbortMultipartUploadCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    AbortMultipartUploadCommandInput,
    AbortMultipartUploadCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class AbortMultipartUploadCommand extends AbortMultipartUploadCommand_base {
  protected static __types: {
    api: {
      input: AbortMultipartUploadRequest;
      output: AbortMultipartUploadOutput;
    };
    sdk: {
      input: AbortMultipartUploadCommandInput;
      output: AbortMultipartUploadCommandOutput;
    };
  };
}
