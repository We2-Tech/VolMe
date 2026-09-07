import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketAclRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketAclCommandInput extends PutBucketAclRequest {}
export interface PutBucketAclCommandOutput extends __MetadataBearer {}
declare const PutBucketAclCommand_base: {
  new (
    input: PutBucketAclCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketAclCommandInput,
    PutBucketAclCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketAclCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketAclCommandInput,
    PutBucketAclCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketAclCommand extends PutBucketAclCommand_base {
  protected static __types: {
    api: {
      input: PutBucketAclRequest;
      output: {};
    };
    sdk: {
      input: PutBucketAclCommandInput;
      output: PutBucketAclCommandOutput;
    };
  };
}
