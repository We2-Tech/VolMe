import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketMetadataConfigurationOutput,
  GetBucketMetadataConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketMetadataConfigurationCommandInput extends GetBucketMetadataConfigurationRequest {}
export interface GetBucketMetadataConfigurationCommandOutput
  extends GetBucketMetadataConfigurationOutput, __MetadataBearer {}
declare const GetBucketMetadataConfigurationCommand_base: {
  new (
    input: GetBucketMetadataConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketMetadataConfigurationCommandInput,
    GetBucketMetadataConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketMetadataConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketMetadataConfigurationCommandInput,
    GetBucketMetadataConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketMetadataConfigurationCommand extends GetBucketMetadataConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketMetadataConfigurationRequest;
      output: GetBucketMetadataConfigurationOutput;
    };
    sdk: {
      input: GetBucketMetadataConfigurationCommandInput;
      output: GetBucketMetadataConfigurationCommandOutput;
    };
  };
}
