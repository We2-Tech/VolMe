import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketPolicyStatusOutput, GetBucketPolicyStatusRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketPolicyStatusCommandInput extends GetBucketPolicyStatusRequest {}
export interface GetBucketPolicyStatusCommandOutput
  extends GetBucketPolicyStatusOutput, __MetadataBearer {}
declare const GetBucketPolicyStatusCommand_base: {
  new (
    input: GetBucketPolicyStatusCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketPolicyStatusCommandInput,
    GetBucketPolicyStatusCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketPolicyStatusCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketPolicyStatusCommandInput,
    GetBucketPolicyStatusCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketPolicyStatusCommand extends GetBucketPolicyStatusCommand_base {
  protected static __types: {
    api: {
      input: GetBucketPolicyStatusRequest;
      output: GetBucketPolicyStatusOutput;
    };
    sdk: {
      input: GetBucketPolicyStatusCommandInput;
      output: GetBucketPolicyStatusCommandOutput;
    };
  };
}
