import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketWebsiteRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketWebsiteCommandInput extends PutBucketWebsiteRequest {}
export interface PutBucketWebsiteCommandOutput extends __MetadataBearer {}
declare const PutBucketWebsiteCommand_base: {
  new (
    input: PutBucketWebsiteCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketWebsiteCommandInput,
    PutBucketWebsiteCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketWebsiteCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketWebsiteCommandInput,
    PutBucketWebsiteCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketWebsiteCommand extends PutBucketWebsiteCommand_base {
  protected static __types: {
    api: {
      input: PutBucketWebsiteRequest;
      output: {};
    };
    sdk: {
      input: PutBucketWebsiteCommandInput;
      output: PutBucketWebsiteCommandOutput;
    };
  };
}
