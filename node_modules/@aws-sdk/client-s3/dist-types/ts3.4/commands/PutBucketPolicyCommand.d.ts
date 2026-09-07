import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketPolicyRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketPolicyCommandInput extends PutBucketPolicyRequest {}
export interface PutBucketPolicyCommandOutput extends __MetadataBearer {}
declare const PutBucketPolicyCommand_base: {
  new (
    input: PutBucketPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketPolicyCommandInput,
    PutBucketPolicyCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketPolicyCommandInput,
    PutBucketPolicyCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketPolicyCommand extends PutBucketPolicyCommand_base {
  protected static __types: {
    api: {
      input: PutBucketPolicyRequest;
      output: {};
    };
    sdk: {
      input: PutBucketPolicyCommandInput;
      output: PutBucketPolicyCommandOutput;
    };
  };
}
