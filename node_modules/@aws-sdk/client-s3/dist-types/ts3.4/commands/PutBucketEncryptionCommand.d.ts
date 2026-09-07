import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketEncryptionRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketEncryptionCommandInput extends PutBucketEncryptionRequest {}
export interface PutBucketEncryptionCommandOutput extends __MetadataBearer {}
declare const PutBucketEncryptionCommand_base: {
  new (
    input: PutBucketEncryptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketEncryptionCommandInput,
    PutBucketEncryptionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketEncryptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketEncryptionCommandInput,
    PutBucketEncryptionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketEncryptionCommand extends PutBucketEncryptionCommand_base {
  protected static __types: {
    api: {
      input: PutBucketEncryptionRequest;
      output: {};
    };
    sdk: {
      input: PutBucketEncryptionCommandInput;
      output: PutBucketEncryptionCommandOutput;
    };
  };
}
