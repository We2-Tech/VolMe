import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketAccelerateConfigurationOutput,
  GetBucketAccelerateConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketAccelerateConfigurationCommandInput extends GetBucketAccelerateConfigurationRequest {}
export interface GetBucketAccelerateConfigurationCommandOutput
  extends GetBucketAccelerateConfigurationOutput, __MetadataBearer {}
declare const GetBucketAccelerateConfigurationCommand_base: {
  new (
    input: GetBucketAccelerateConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketAccelerateConfigurationCommandInput,
    GetBucketAccelerateConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketAccelerateConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketAccelerateConfigurationCommandInput,
    GetBucketAccelerateConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketAccelerateConfigurationCommand extends GetBucketAccelerateConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketAccelerateConfigurationRequest;
      output: GetBucketAccelerateConfigurationOutput;
    };
    sdk: {
      input: GetBucketAccelerateConfigurationCommandInput;
      output: GetBucketAccelerateConfigurationCommandOutput;
    };
  };
}
