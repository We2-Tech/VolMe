import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketAclOutput, GetBucketAclRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketAclCommandInput extends GetBucketAclRequest {}
export interface GetBucketAclCommandOutput extends GetBucketAclOutput, __MetadataBearer {}
declare const GetBucketAclCommand_base: {
  new (
    input: GetBucketAclCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketAclCommandInput,
    GetBucketAclCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketAclCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketAclCommandInput,
    GetBucketAclCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketAclCommand extends GetBucketAclCommand_base {
  protected static __types: {
    api: {
      input: GetBucketAclRequest;
      output: GetBucketAclOutput;
    };
    sdk: {
      input: GetBucketAclCommandInput;
      output: GetBucketAclCommandOutput;
    };
  };
}
