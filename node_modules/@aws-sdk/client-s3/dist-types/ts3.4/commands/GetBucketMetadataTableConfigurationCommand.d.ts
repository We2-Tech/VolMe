import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketMetadataTableConfigurationOutput,
  GetBucketMetadataTableConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketMetadataTableConfigurationCommandInput extends GetBucketMetadataTableConfigurationRequest {}
export interface GetBucketMetadataTableConfigurationCommandOutput
  extends GetBucketMetadataTableConfigurationOutput, __MetadataBearer {}
declare const GetBucketMetadataTableConfigurationCommand_base: {
  new (
    input: GetBucketMetadataTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketMetadataTableConfigurationCommandInput,
    GetBucketMetadataTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketMetadataTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketMetadataTableConfigurationCommandInput,
    GetBucketMetadataTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketMetadataTableConfigurationCommand extends GetBucketMetadataTableConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketMetadataTableConfigurationRequest;
      output: GetBucketMetadataTableConfigurationOutput;
    };
    sdk: {
      input: GetBucketMetadataTableConfigurationCommandInput;
      output: GetBucketMetadataTableConfigurationCommandOutput;
    };
  };
}
