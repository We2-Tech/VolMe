import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketPolicyRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketPolicyCommandInput extends DeleteBucketPolicyRequest {}
export interface DeleteBucketPolicyCommandOutput extends __MetadataBearer {}
declare const DeleteBucketPolicyCommand_base: {
  new (
    input: DeleteBucketPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketPolicyCommandInput,
    DeleteBucketPolicyCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketPolicyCommandInput,
    DeleteBucketPolicyCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketPolicyCommand extends DeleteBucketPolicyCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketPolicyRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketPolicyCommandInput;
      output: DeleteBucketPolicyCommandOutput;
    };
  };
}
