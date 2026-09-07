import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketTaggingOutput, GetBucketTaggingRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketTaggingCommandInput extends GetBucketTaggingRequest {}
export interface GetBucketTaggingCommandOutput extends GetBucketTaggingOutput, __MetadataBearer {}
declare const GetBucketTaggingCommand_base: {
  new (
    input: GetBucketTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketTaggingCommandInput,
    GetBucketTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketTaggingCommandInput,
    GetBucketTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketTaggingCommand extends GetBucketTaggingCommand_base {
  protected static __types: {
    api: {
      input: GetBucketTaggingRequest;
      output: GetBucketTaggingOutput;
    };
    sdk: {
      input: GetBucketTaggingCommandInput;
      output: GetBucketTaggingCommandOutput;
    };
  };
}
