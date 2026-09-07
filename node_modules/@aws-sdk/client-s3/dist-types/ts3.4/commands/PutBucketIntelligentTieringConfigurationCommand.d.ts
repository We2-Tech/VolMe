import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketIntelligentTieringConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketIntelligentTieringConfigurationCommandInput extends PutBucketIntelligentTieringConfigurationRequest {}
export interface PutBucketIntelligentTieringConfigurationCommandOutput extends __MetadataBearer {}
declare const PutBucketIntelligentTieringConfigurationCommand_base: {
  new (
    input: PutBucketIntelligentTieringConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketIntelligentTieringConfigurationCommandInput,
    PutBucketIntelligentTieringConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketIntelligentTieringConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketIntelligentTieringConfigurationCommandInput,
    PutBucketIntelligentTieringConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketIntelligentTieringConfigurationCommand extends PutBucketIntelligentTieringConfigurationCommand_base {
  protected static __types: {
    api: {
      input: PutBucketIntelligentTieringConfigurationRequest;
      output: {};
    };
    sdk: {
      input: PutBucketIntelligentTieringConfigurationCommandInput;
      output: PutBucketIntelligentTieringConfigurationCommandOutput;
    };
  };
}
