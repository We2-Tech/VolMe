import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketMetadataConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketMetadataConfigurationCommandInput extends DeleteBucketMetadataConfigurationRequest {}
export interface DeleteBucketMetadataConfigurationCommandOutput extends __MetadataBearer {}
declare const DeleteBucketMetadataConfigurationCommand_base: {
  new (
    input: DeleteBucketMetadataConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketMetadataConfigurationCommandInput,
    DeleteBucketMetadataConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketMetadataConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketMetadataConfigurationCommandInput,
    DeleteBucketMetadataConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketMetadataConfigurationCommand extends DeleteBucketMetadataConfigurationCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketMetadataConfigurationRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketMetadataConfigurationCommandInput;
      output: DeleteBucketMetadataConfigurationCommandOutput;
    };
  };
}
