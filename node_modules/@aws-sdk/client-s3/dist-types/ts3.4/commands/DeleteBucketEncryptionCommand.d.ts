import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketEncryptionRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketEncryptionCommandInput extends DeleteBucketEncryptionRequest {}
export interface DeleteBucketEncryptionCommandOutput extends __MetadataBearer {}
declare const DeleteBucketEncryptionCommand_base: {
  new (
    input: DeleteBucketEncryptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketEncryptionCommandInput,
    DeleteBucketEncryptionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketEncryptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketEncryptionCommandInput,
    DeleteBucketEncryptionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketEncryptionCommand extends DeleteBucketEncryptionCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketEncryptionRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketEncryptionCommandInput;
      output: DeleteBucketEncryptionCommandOutput;
    };
  };
}
