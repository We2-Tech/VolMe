import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketMetricsConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketMetricsConfigurationCommandInput extends PutBucketMetricsConfigurationRequest {}
export interface PutBucketMetricsConfigurationCommandOutput extends __MetadataBearer {}
declare const PutBucketMetricsConfigurationCommand_base: {
  new (
    input: PutBucketMetricsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketMetricsConfigurationCommandInput,
    PutBucketMetricsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketMetricsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketMetricsConfigurationCommandInput,
    PutBucketMetricsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketMetricsConfigurationCommand extends PutBucketMetricsConfigurationCommand_base {
  protected static __types: {
    api: {
      input: PutBucketMetricsConfigurationRequest;
      output: {};
    };
    sdk: {
      input: PutBucketMetricsConfigurationCommandInput;
      output: PutBucketMetricsConfigurationCommandOutput;
    };
  };
}
