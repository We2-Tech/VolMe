import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketWebsiteOutput, GetBucketWebsiteRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketWebsiteCommandInput extends GetBucketWebsiteRequest {}
export interface GetBucketWebsiteCommandOutput extends GetBucketWebsiteOutput, __MetadataBearer {}
declare const GetBucketWebsiteCommand_base: {
  new (
    input: GetBucketWebsiteCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketWebsiteCommandInput,
    GetBucketWebsiteCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketWebsiteCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketWebsiteCommandInput,
    GetBucketWebsiteCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketWebsiteCommand extends GetBucketWebsiteCommand_base {
  protected static __types: {
    api: {
      input: GetBucketWebsiteRequest;
      output: GetBucketWebsiteOutput;
    };
    sdk: {
      input: GetBucketWebsiteCommandInput;
      output: GetBucketWebsiteCommandOutput;
    };
  };
}
