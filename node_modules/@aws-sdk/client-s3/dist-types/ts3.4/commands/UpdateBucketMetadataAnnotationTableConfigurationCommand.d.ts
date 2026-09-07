import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UpdateBucketMetadataAnnotationTableConfigurationRequest } from "../models/models_1";
export { __MetadataBearer };
export interface UpdateBucketMetadataAnnotationTableConfigurationCommandInput extends UpdateBucketMetadataAnnotationTableConfigurationRequest {}
export interface UpdateBucketMetadataAnnotationTableConfigurationCommandOutput extends __MetadataBearer {}
declare const UpdateBucketMetadataAnnotationTableConfigurationCommand_base: {
  new (
    input: UpdateBucketMetadataAnnotationTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateBucketMetadataAnnotationTableConfigurationCommandInput,
    UpdateBucketMetadataAnnotationTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateBucketMetadataAnnotationTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateBucketMetadataAnnotationTableConfigurationCommandInput,
    UpdateBucketMetadataAnnotationTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateBucketMetadataAnnotationTableConfigurationCommand extends UpdateBucketMetadataAnnotationTableConfigurationCommand_base {
  protected static __types: {
    api: {
      input: UpdateBucketMetadataAnnotationTableConfigurationRequest;
      output: {};
    };
    sdk: {
      input: UpdateBucketMetadataAnnotationTableConfigurationCommandInput;
      output: UpdateBucketMetadataAnnotationTableConfigurationCommandOutput;
    };
  };
}
