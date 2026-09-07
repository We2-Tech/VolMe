import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketNotificationConfigurationRequest,
  NotificationConfiguration,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketNotificationConfigurationCommandInput extends GetBucketNotificationConfigurationRequest {}
export interface GetBucketNotificationConfigurationCommandOutput
  extends NotificationConfiguration, __MetadataBearer {}
declare const GetBucketNotificationConfigurationCommand_base: {
  new (
    input: GetBucketNotificationConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketNotificationConfigurationCommandInput,
    GetBucketNotificationConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketNotificationConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketNotificationConfigurationCommandInput,
    GetBucketNotificationConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketNotificationConfigurationCommand extends GetBucketNotificationConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketNotificationConfigurationRequest;
      output: NotificationConfiguration;
    };
    sdk: {
      input: GetBucketNotificationConfigurationCommandInput;
      output: GetBucketNotificationConfigurationCommandOutput;
    };
  };
}
