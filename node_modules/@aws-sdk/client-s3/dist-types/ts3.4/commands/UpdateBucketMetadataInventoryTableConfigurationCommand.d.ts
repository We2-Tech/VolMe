import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UpdateBucketMetadataInventoryTableConfigurationRequest } from "../models/models_1";
export { __MetadataBearer };
export interface UpdateBucketMetadataInventoryTableConfigurationCommandInput extends UpdateBucketMetadataInventoryTableConfigurationRequest {}
export interface UpdateBucketMetadataInventoryTableConfigurationCommandOutput extends __MetadataBearer {}
declare const UpdateBucketMetadataInventoryTableConfigurationCommand_base: {
  new (
    input: UpdateBucketMetadataInventoryTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateBucketMetadataInventoryTableConfigurationCommandInput,
    UpdateBucketMetadataInventoryTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateBucketMetadataInventoryTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateBucketMetadataInventoryTableConfigurationCommandInput,
    UpdateBucketMetadataInventoryTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateBucketMetadataInventoryTableConfigurationCommand extends UpdateBucketMetadataInventoryTableConfigurationCommand_base {
  protected static __types: {
    api: {
      input: UpdateBucketMetadataInventoryTableConfigurationRequest;
      output: {};
    };
    sdk: {
      input: UpdateBucketMetadataInventoryTableConfigurationCommandInput;
      output: UpdateBucketMetadataInventoryTableConfigurationCommandOutput;
    };
  };
}
