import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListBucketAnalyticsConfigurationsOutput,
  ListBucketAnalyticsConfigurationsRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListBucketAnalyticsConfigurationsCommandInput extends ListBucketAnalyticsConfigurationsRequest {}
export interface ListBucketAnalyticsConfigurationsCommandOutput
  extends ListBucketAnalyticsConfigurationsOutput, __MetadataBearer {}
declare const ListBucketAnalyticsConfigurationsCommand_base: {
  new (
    input: ListBucketAnalyticsConfigurationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketAnalyticsConfigurationsCommandInput,
    ListBucketAnalyticsConfigurationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListBucketAnalyticsConfigurationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketAnalyticsConfigurationsCommandInput,
    ListBucketAnalyticsConfigurationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListBucketAnalyticsConfigurationsCommand extends ListBucketAnalyticsConfigurationsCommand_base {
  protected static __types: {
    api: {
      input: ListBucketAnalyticsConfigurationsRequest;
      output: ListBucketAnalyticsConfigurationsOutput;
    };
    sdk: {
      input: ListBucketAnalyticsConfigurationsCommandInput;
      output: ListBucketAnalyticsConfigurationsCommandOutput;
    };
  };
}
