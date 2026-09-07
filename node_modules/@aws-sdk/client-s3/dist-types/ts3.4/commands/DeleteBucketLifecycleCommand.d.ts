import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketLifecycleRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketLifecycleCommandInput extends DeleteBucketLifecycleRequest {}
export interface DeleteBucketLifecycleCommandOutput extends __MetadataBearer {}
declare const DeleteBucketLifecycleCommand_base: {
  new (
    input: DeleteBucketLifecycleCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketLifecycleCommandInput,
    DeleteBucketLifecycleCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketLifecycleCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketLifecycleCommandInput,
    DeleteBucketLifecycleCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketLifecycleCommand extends DeleteBucketLifecycleCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketLifecycleRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketLifecycleCommandInput;
      output: DeleteBucketLifecycleCommandOutput;
    };
  };
}
