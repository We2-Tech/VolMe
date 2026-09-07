import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketInventoryConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketInventoryConfigurationCommandInput extends PutBucketInventoryConfigurationRequest {}
export interface PutBucketInventoryConfigurationCommandOutput extends __MetadataBearer {}
declare const PutBucketInventoryConfigurationCommand_base: {
  new (
    input: PutBucketInventoryConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketInventoryConfigurationCommandInput,
    PutBucketInventoryConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketInventoryConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketInventoryConfigurationCommandInput,
    PutBucketInventoryConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketInventoryConfigurationCommand extends PutBucketInventoryConfigurationCommand_base {
  protected static __types: {
    api: {
      input: PutBucketInventoryConfigurationRequest;
      output: {};
    };
    sdk: {
      input: PutBucketInventoryConfigurationCommandInput;
      output: PutBucketInventoryConfigurationCommandOutput;
    };
  };
}
