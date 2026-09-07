import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListBucketMetricsConfigurationsOutput,
  ListBucketMetricsConfigurationsRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListBucketMetricsConfigurationsCommandInput extends ListBucketMetricsConfigurationsRequest {}
export interface ListBucketMetricsConfigurationsCommandOutput
  extends ListBucketMetricsConfigurationsOutput, __MetadataBearer {}
declare const ListBucketMetricsConfigurationsCommand_base: {
  new (
    input: ListBucketMetricsConfigurationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketMetricsConfigurationsCommandInput,
    ListBucketMetricsConfigurationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListBucketMetricsConfigurationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketMetricsConfigurationsCommandInput,
    ListBucketMetricsConfigurationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListBucketMetricsConfigurationsCommand extends ListBucketMetricsConfigurationsCommand_base {
  protected static __types: {
    api: {
      input: ListBucketMetricsConfigurationsRequest;
      output: ListBucketMetricsConfigurationsOutput;
    };
    sdk: {
      input: ListBucketMetricsConfigurationsCommandInput;
      output: ListBucketMetricsConfigurationsCommandOutput;
    };
  };
}
