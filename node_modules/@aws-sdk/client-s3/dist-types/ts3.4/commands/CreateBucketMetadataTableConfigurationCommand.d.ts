import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateBucketMetadataTableConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface CreateBucketMetadataTableConfigurationCommandInput extends CreateBucketMetadataTableConfigurationRequest {}
export interface CreateBucketMetadataTableConfigurationCommandOutput extends __MetadataBearer {}
declare const CreateBucketMetadataTableConfigurationCommand_base: {
  new (
    input: CreateBucketMetadataTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateBucketMetadataTableConfigurationCommandInput,
    CreateBucketMetadataTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateBucketMetadataTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateBucketMetadataTableConfigurationCommandInput,
    CreateBucketMetadataTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateBucketMetadataTableConfigurationCommand extends CreateBucketMetadataTableConfigurationCommand_base {
  protected static __types: {
    api: {
      input: CreateBucketMetadataTableConfigurationRequest;
      output: {};
    };
    sdk: {
      input: CreateBucketMetadataTableConfigurationCommandInput;
      output: CreateBucketMetadataTableConfigurationCommandOutput;
    };
  };
}
