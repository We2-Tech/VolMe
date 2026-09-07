import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketMetricsConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketMetricsConfigurationCommandInput extends DeleteBucketMetricsConfigurationRequest {}
export interface DeleteBucketMetricsConfigurationCommandOutput extends __MetadataBearer {}
declare const DeleteBucketMetricsConfigurationCommand_base: {
  new (
    input: DeleteBucketMetricsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketMetricsConfigurationCommandInput,
    DeleteBucketMetricsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketMetricsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketMetricsConfigurationCommandInput,
    DeleteBucketMetricsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketMetricsConfigurationCommand extends DeleteBucketMetricsConfigurationCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketMetricsConfigurationRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketMetricsConfigurationCommandInput;
      output: DeleteBucketMetricsConfigurationCommandOutput;
    };
  };
}
