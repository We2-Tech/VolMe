import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListBucketIntelligentTieringConfigurationsOutput,
  ListBucketIntelligentTieringConfigurationsRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListBucketIntelligentTieringConfigurationsCommandInput extends ListBucketIntelligentTieringConfigurationsRequest {}
export interface ListBucketIntelligentTieringConfigurationsCommandOutput
  extends ListBucketIntelligentTieringConfigurationsOutput, __MetadataBearer {}
declare const ListBucketIntelligentTieringConfigurationsCommand_base: {
  new (
    input: ListBucketIntelligentTieringConfigurationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketIntelligentTieringConfigurationsCommandInput,
    ListBucketIntelligentTieringConfigurationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListBucketIntelligentTieringConfigurationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketIntelligentTieringConfigurationsCommandInput,
    ListBucketIntelligentTieringConfigurationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListBucketIntelligentTieringConfigurationsCommand extends ListBucketIntelligentTieringConfigurationsCommand_base {
  protected static __types: {
    api: {
      input: ListBucketIntelligentTieringConfigurationsRequest;
      output: ListBucketIntelligentTieringConfigurationsOutput;
    };
    sdk: {
      input: ListBucketIntelligentTieringConfigurationsCommandInput;
      output: ListBucketIntelligentTieringConfigurationsCommandOutput;
    };
  };
}
