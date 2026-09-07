import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketVersioningOutput, GetBucketVersioningRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketVersioningCommandInput extends GetBucketVersioningRequest {}
export interface GetBucketVersioningCommandOutput
  extends GetBucketVersioningOutput, __MetadataBearer {}
declare const GetBucketVersioningCommand_base: {
  new (
    input: GetBucketVersioningCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketVersioningCommandInput,
    GetBucketVersioningCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketVersioningCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketVersioningCommandInput,
    GetBucketVersioningCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketVersioningCommand extends GetBucketVersioningCommand_base {
  protected static __types: {
    api: {
      input: GetBucketVersioningRequest;
      output: GetBucketVersioningOutput;
    };
    sdk: {
      input: GetBucketVersioningCommandInput;
      output: GetBucketVersioningCommandOutput;
    };
  };
}
