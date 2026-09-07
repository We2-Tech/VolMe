import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateMultipartUploadOutput, CreateMultipartUploadRequest } from "../models/models_0";
export { __MetadataBearer };
export interface CreateMultipartUploadCommandInput extends CreateMultipartUploadRequest {}
export interface CreateMultipartUploadCommandOutput
  extends CreateMultipartUploadOutput, __MetadataBearer {}
declare const CreateMultipartUploadCommand_base: {
  new (
    input: CreateMultipartUploadCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateMultipartUploadCommandInput,
    CreateMultipartUploadCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateMultipartUploadCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateMultipartUploadCommandInput,
    CreateMultipartUploadCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateMultipartUploadCommand extends CreateMultipartUploadCommand_base {
  protected static __types: {
    api: {
      input: CreateMultipartUploadRequest;
      output: CreateMultipartUploadOutput;
    };
    sdk: {
      input: CreateMultipartUploadCommandInput;
      output: CreateMultipartUploadCommandOutput;
    };
  };
}
