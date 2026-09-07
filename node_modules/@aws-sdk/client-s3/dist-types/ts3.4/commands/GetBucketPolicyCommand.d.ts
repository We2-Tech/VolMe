import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketPolicyOutput, GetBucketPolicyRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketPolicyCommandInput extends GetBucketPolicyRequest {}
export interface GetBucketPolicyCommandOutput extends GetBucketPolicyOutput, __MetadataBearer {}
declare const GetBucketPolicyCommand_base: {
  new (
    input: GetBucketPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketPolicyCommandInput,
    GetBucketPolicyCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketPolicyCommandInput,
    GetBucketPolicyCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketPolicyCommand extends GetBucketPolicyCommand_base {
  protected static __types: {
    api: {
      input: GetBucketPolicyRequest;
      output: GetBucketPolicyOutput;
    };
    sdk: {
      input: GetBucketPolicyCommandInput;
      output: GetBucketPolicyCommandOutput;
    };
  };
}
