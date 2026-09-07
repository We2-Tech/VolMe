import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketAnalyticsConfigurationOutput,
  GetBucketAnalyticsConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketAnalyticsConfigurationCommandInput extends GetBucketAnalyticsConfigurationRequest {}
export interface GetBucketAnalyticsConfigurationCommandOutput
  extends GetBucketAnalyticsConfigurationOutput, __MetadataBearer {}
declare const GetBucketAnalyticsConfigurationCommand_base: {
  new (
    input: GetBucketAnalyticsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketAnalyticsConfigurationCommandInput,
    GetBucketAnalyticsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketAnalyticsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketAnalyticsConfigurationCommandInput,
    GetBucketAnalyticsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketAnalyticsConfigurationCommand extends GetBucketAnalyticsConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketAnalyticsConfigurationRequest;
      output: GetBucketAnalyticsConfigurationOutput;
    };
    sdk: {
      input: GetBucketAnalyticsConfigurationCommandInput;
      output: GetBucketAnalyticsConfigurationCommandOutput;
    };
  };
}
