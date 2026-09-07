import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CompleteMultipartUploadOutput, CompleteMultipartUploadRequest } from "../models/models_0";
export { __MetadataBearer };
export interface CompleteMultipartUploadCommandInput extends CompleteMultipartUploadRequest {}
export interface CompleteMultipartUploadCommandOutput
  extends CompleteMultipartUploadOutput, __MetadataBearer {}
declare const CompleteMultipartUploadCommand_base: {
  new (
    input: CompleteMultipartUploadCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CompleteMultipartUploadCommandInput,
    CompleteMultipartUploadCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CompleteMultipartUploadCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CompleteMultipartUploadCommandInput,
    CompleteMultipartUploadCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CompleteMultipartUploadCommand extends CompleteMultipartUploadCommand_base {
  protected static __types: {
    api: {
      input: CompleteMultipartUploadRequest;
      output: CompleteMultipartUploadOutput;
    };
    sdk: {
      input: CompleteMultipartUploadCommandInput;
      output: CompleteMultipartUploadCommandOutput;
    };
  };
}
