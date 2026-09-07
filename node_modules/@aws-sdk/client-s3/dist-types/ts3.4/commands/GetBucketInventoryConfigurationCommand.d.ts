import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketInventoryConfigurationOutput,
  GetBucketInventoryConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketInventoryConfigurationCommandInput extends GetBucketInventoryConfigurationRequest {}
export interface GetBucketInventoryConfigurationCommandOutput
  extends GetBucketInventoryConfigurationOutput, __MetadataBearer {}
declare const GetBucketInventoryConfigurationCommand_base: {
  new (
    input: GetBucketInventoryConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketInventoryConfigurationCommandInput,
    GetBucketInventoryConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketInventoryConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketInventoryConfigurationCommandInput,
    GetBucketInventoryConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketInventoryConfigurationCommand extends GetBucketInventoryConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketInventoryConfigurationRequest;
      output: GetBucketInventoryConfigurationOutput;
    };
    sdk: {
      input: GetBucketInventoryConfigurationCommandInput;
      output: GetBucketInventoryConfigurationCommandOutput;
    };
  };
}
