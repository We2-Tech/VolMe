import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketAnalyticsConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketAnalyticsConfigurationCommandInput extends DeleteBucketAnalyticsConfigurationRequest {}
export interface DeleteBucketAnalyticsConfigurationCommandOutput extends __MetadataBearer {}
declare const DeleteBucketAnalyticsConfigurationCommand_base: {
  new (
    input: DeleteBucketAnalyticsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketAnalyticsConfigurationCommandInput,
    DeleteBucketAnalyticsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketAnalyticsConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketAnalyticsConfigurationCommandInput,
    DeleteBucketAnalyticsConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketAnalyticsConfigurationCommand extends DeleteBucketAnalyticsConfigurationCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketAnalyticsConfigurationRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketAnalyticsConfigurationCommandInput;
      output: DeleteBucketAnalyticsConfigurationCommandOutput;
    };
  };
}
