import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutBucketLifecycleConfigurationOutput,
  PutBucketLifecycleConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketLifecycleConfigurationCommandInput extends PutBucketLifecycleConfigurationRequest {}
export interface PutBucketLifecycleConfigurationCommandOutput
  extends PutBucketLifecycleConfigurationOutput, __MetadataBearer {}
declare const PutBucketLifecycleConfigurationCommand_base: {
  new (
    input: PutBucketLifecycleConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketLifecycleConfigurationCommandInput,
    PutBucketLifecycleConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketLifecycleConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketLifecycleConfigurationCommandInput,
    PutBucketLifecycleConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketLifecycleConfigurationCommand extends PutBucketLifecycleConfigurationCommand_base {
  protected static __types: {
    api: {
      input: PutBucketLifecycleConfigurationRequest;
      output: PutBucketLifecycleConfigurationOutput;
    };
    sdk: {
      input: PutBucketLifecycleConfigurationCommandInput;
      output: PutBucketLifecycleConfigurationCommandOutput;
    };
  };
}
