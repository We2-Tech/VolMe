import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketAccelerateConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketAccelerateConfigurationCommandInput extends PutBucketAccelerateConfigurationRequest {}
export interface PutBucketAccelerateConfigurationCommandOutput extends __MetadataBearer {}
declare const PutBucketAccelerateConfigurationCommand_base: {
  new (
    input: PutBucketAccelerateConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketAccelerateConfigurationCommandInput,
    PutBucketAccelerateConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketAccelerateConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketAccelerateConfigurationCommandInput,
    PutBucketAccelerateConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketAccelerateConfigurationCommand extends PutBucketAccelerateConfigurationCommand_base {
  protected static __types: {
    api: {
      input: PutBucketAccelerateConfigurationRequest;
      output: {};
    };
    sdk: {
      input: PutBucketAccelerateConfigurationCommandInput;
      output: PutBucketAccelerateConfigurationCommandOutput;
    };
  };
}
