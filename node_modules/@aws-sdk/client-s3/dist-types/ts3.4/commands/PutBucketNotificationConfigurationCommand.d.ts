import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketNotificationConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketNotificationConfigurationCommandInput extends PutBucketNotificationConfigurationRequest {}
export interface PutBucketNotificationConfigurationCommandOutput extends __MetadataBearer {}
declare const PutBucketNotificationConfigurationCommand_base: {
  new (
    input: PutBucketNotificationConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketNotificationConfigurationCommandInput,
    PutBucketNotificationConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketNotificationConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketNotificationConfigurationCommandInput,
    PutBucketNotificationConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketNotificationConfigurationCommand extends PutBucketNotificationConfigurationCommand_base {
  protected static __types: {
    api: {
      input: PutBucketNotificationConfigurationRequest;
      output: {};
    };
    sdk: {
      input: PutBucketNotificationConfigurationCommandInput;
      output: PutBucketNotificationConfigurationCommandOutput;
    };
  };
}
