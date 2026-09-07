import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListBucketInventoryConfigurationsOutput,
  ListBucketInventoryConfigurationsRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListBucketInventoryConfigurationsCommandInput extends ListBucketInventoryConfigurationsRequest {}
export interface ListBucketInventoryConfigurationsCommandOutput
  extends ListBucketInventoryConfigurationsOutput, __MetadataBearer {}
declare const ListBucketInventoryConfigurationsCommand_base: {
  new (
    input: ListBucketInventoryConfigurationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketInventoryConfigurationsCommandInput,
    ListBucketInventoryConfigurationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListBucketInventoryConfigurationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketInventoryConfigurationsCommandInput,
    ListBucketInventoryConfigurationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListBucketInventoryConfigurationsCommand extends ListBucketInventoryConfigurationsCommand_base {
  protected static __types: {
    api: {
      input: ListBucketInventoryConfigurationsRequest;
      output: ListBucketInventoryConfigurationsOutput;
    };
    sdk: {
      input: ListBucketInventoryConfigurationsCommandInput;
      output: ListBucketInventoryConfigurationsCommandOutput;
    };
  };
}
