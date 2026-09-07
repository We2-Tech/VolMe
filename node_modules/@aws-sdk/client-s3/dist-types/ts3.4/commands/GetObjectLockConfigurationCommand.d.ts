import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetObjectLockConfigurationOutput,
  GetObjectLockConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectLockConfigurationCommandInput extends GetObjectLockConfigurationRequest {}
export interface GetObjectLockConfigurationCommandOutput
  extends GetObjectLockConfigurationOutput, __MetadataBearer {}
declare const GetObjectLockConfigurationCommand_base: {
  new (
    input: GetObjectLockConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectLockConfigurationCommandInput,
    GetObjectLockConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectLockConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectLockConfigurationCommandInput,
    GetObjectLockConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectLockConfigurationCommand extends GetObjectLockConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetObjectLockConfigurationRequest;
      output: GetObjectLockConfigurationOutput;
    };
    sdk: {
      input: GetObjectLockConfigurationCommandInput;
      output: GetObjectLockConfigurationCommandOutput;
    };
  };
}
