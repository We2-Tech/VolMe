import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketAnalyticsConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketAnalyticsConfigurationCommandInput extends PutBucketAnalyticsConfigurationRequest {}
export interface PutBucketAnalyticsConfigurationCommandOutput extends __MetadataBearer {}
declare const PutBucketAnalyticsConfigurationCommand_base: {
  new (
    input: PutBucketAnalyticsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketAnalyticsConfigurationCommandInput,
    PutBucketAnalyticsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketAnalyticsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketAnalyticsConfigurationCommandInput,
    PutBucketAnalyticsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketAnalyticsConfigurationCommand extends PutBucketAnalyticsConfigurationCommand_base {
  protected static __types: {
    api: {
      input: PutBucketAnalyticsConfigurationRequest;
      output: {};
    };
    sdk: {
      input: PutBucketAnalyticsConfigurationCommandInput;
      output: PutBucketAnalyticsConfigurationCommandOutput;
    };
  };
}
