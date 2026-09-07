import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketMetricsConfigurationOutput,
  GetBucketMetricsConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketMetricsConfigurationCommandInput extends GetBucketMetricsConfigurationRequest {}
export interface GetBucketMetricsConfigurationCommandOutput
  extends GetBucketMetricsConfigurationOutput, __MetadataBearer {}
declare const GetBucketMetricsConfigurationCommand_base: {
  new (
    input: GetBucketMetricsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketMetricsConfigurationCommandInput,
    GetBucketMetricsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketMetricsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketMetricsConfigurationCommandInput,
    GetBucketMetricsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketMetricsConfigurationCommand extends GetBucketMetricsConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketMetricsConfigurationRequest;
      output: GetBucketMetricsConfigurationOutput;
    };
    sdk: {
      input: GetBucketMetricsConfigurationCommandInput;
      output: GetBucketMetricsConfigurationCommandOutput;
    };
  };
}
