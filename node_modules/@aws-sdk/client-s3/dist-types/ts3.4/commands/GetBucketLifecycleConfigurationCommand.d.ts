import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketLifecycleConfigurationOutput,
  GetBucketLifecycleConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketLifecycleConfigurationCommandInput extends GetBucketLifecycleConfigurationRequest {}
export interface GetBucketLifecycleConfigurationCommandOutput
  extends GetBucketLifecycleConfigurationOutput, __MetadataBearer {}
declare const GetBucketLifecycleConfigurationCommand_base: {
  new (
    input: GetBucketLifecycleConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketLifecycleConfigurationCommandInput,
    GetBucketLifecycleConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketLifecycleConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketLifecycleConfigurationCommandInput,
    GetBucketLifecycleConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketLifecycleConfigurationCommand extends GetBucketLifecycleConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketLifecycleConfigurationRequest;
      output: GetBucketLifecycleConfigurationOutput;
    };
    sdk: {
      input: GetBucketLifecycleConfigurationCommandInput;
      output: GetBucketLifecycleConfigurationCommandOutput;
    };
  };
}
