import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutObjectLockConfigurationOutput,
  PutObjectLockConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutObjectLockConfigurationCommandInput extends PutObjectLockConfigurationRequest {}
export interface PutObjectLockConfigurationCommandOutput
  extends PutObjectLockConfigurationOutput, __MetadataBearer {}
declare const PutObjectLockConfigurationCommand_base: {
  new (
    input: PutObjectLockConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectLockConfigurationCommandInput,
    PutObjectLockConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutObjectLockConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectLockConfigurationCommandInput,
    PutObjectLockConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutObjectLockConfigurationCommand extends PutObjectLockConfigurationCommand_base {
  protected static __types: {
    api: {
      input: PutObjectLockConfigurationRequest;
      output: PutObjectLockConfigurationOutput;
    };
    sdk: {
      input: PutObjectLockConfigurationCommandInput;
      output: PutObjectLockConfigurationCommandOutput;
    };
  };
}
