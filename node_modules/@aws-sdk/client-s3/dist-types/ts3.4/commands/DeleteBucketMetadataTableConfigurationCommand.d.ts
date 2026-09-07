import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketMetadataTableConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketMetadataTableConfigurationCommandInput extends DeleteBucketMetadataTableConfigurationRequest {}
export interface DeleteBucketMetadataTableConfigurationCommandOutput extends __MetadataBearer {}
declare const DeleteBucketMetadataTableConfigurationCommand_base: {
  new (
    input: DeleteBucketMetadataTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketMetadataTableConfigurationCommandInput,
    DeleteBucketMetadataTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketMetadataTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketMetadataTableConfigurationCommandInput,
    DeleteBucketMetadataTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketMetadataTableConfigurationCommand extends DeleteBucketMetadataTableConfigurationCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketMetadataTableConfigurationRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketMetadataTableConfigurationCommandInput;
      output: DeleteBucketMetadataTableConfigurationCommandOutput;
    };
  };
}
