import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateBucketMetadataConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface CreateBucketMetadataConfigurationCommandInput extends CreateBucketMetadataConfigurationRequest {}
export interface CreateBucketMetadataConfigurationCommandOutput extends __MetadataBearer {}
declare const CreateBucketMetadataConfigurationCommand_base: {
  new (
    input: CreateBucketMetadataConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateBucketMetadataConfigurationCommandInput,
    CreateBucketMetadataConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateBucketMetadataConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateBucketMetadataConfigurationCommandInput,
    CreateBucketMetadataConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateBucketMetadataConfigurationCommand extends CreateBucketMetadataConfigurationCommand_base {
  protected static __types: {
    api: {
      input: CreateBucketMetadataConfigurationRequest;
      output: {};
    };
    sdk: {
      input: CreateBucketMetadataConfigurationCommandInput;
      output: CreateBucketMetadataConfigurationCommandOutput;
    };
  };
}
