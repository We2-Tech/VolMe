import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketInventoryConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketInventoryConfigurationCommandInput extends DeleteBucketInventoryConfigurationRequest {}
export interface DeleteBucketInventoryConfigurationCommandOutput extends __MetadataBearer {}
declare const DeleteBucketInventoryConfigurationCommand_base: {
  new (
    input: DeleteBucketInventoryConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketInventoryConfigurationCommandInput,
    DeleteBucketInventoryConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketInventoryConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketInventoryConfigurationCommandInput,
    DeleteBucketInventoryConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketInventoryConfigurationCommand extends DeleteBucketInventoryConfigurationCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketInventoryConfigurationRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketInventoryConfigurationCommandInput;
      output: DeleteBucketInventoryConfigurationCommandOutput;
    };
  };
}
