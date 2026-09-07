import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketEncryptionOutput, GetBucketEncryptionRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketEncryptionCommandInput extends GetBucketEncryptionRequest {}
export interface GetBucketEncryptionCommandOutput
  extends GetBucketEncryptionOutput, __MetadataBearer {}
declare const GetBucketEncryptionCommand_base: {
  new (
    input: GetBucketEncryptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketEncryptionCommandInput,
    GetBucketEncryptionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketEncryptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketEncryptionCommandInput,
    GetBucketEncryptionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketEncryptionCommand extends GetBucketEncryptionCommand_base {
  protected static __types: {
    api: {
      input: GetBucketEncryptionRequest;
      output: GetBucketEncryptionOutput;
    };
    sdk: {
      input: GetBucketEncryptionCommandInput;
      output: GetBucketEncryptionCommandOutput;
    };
  };
}
