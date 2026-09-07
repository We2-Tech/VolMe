import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketIntelligentTieringConfigurationOutput,
  GetBucketIntelligentTieringConfigurationRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketIntelligentTieringConfigurationCommandInput extends GetBucketIntelligentTieringConfigurationRequest {}
export interface GetBucketIntelligentTieringConfigurationCommandOutput
  extends GetBucketIntelligentTieringConfigurationOutput, __MetadataBearer {}
declare const GetBucketIntelligentTieringConfigurationCommand_base: {
  new (
    input: GetBucketIntelligentTieringConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketIntelligentTieringConfigurationCommandInput,
    GetBucketIntelligentTieringConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketIntelligentTieringConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketIntelligentTieringConfigurationCommandInput,
    GetBucketIntelligentTieringConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketIntelligentTieringConfigurationCommand extends GetBucketIntelligentTieringConfigurationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketIntelligentTieringConfigurationRequest;
      output: GetBucketIntelligentTieringConfigurationOutput;
    };
    sdk: {
      input: GetBucketIntelligentTieringConfigurationCommandInput;
      output: GetBucketIntelligentTieringConfigurationCommandOutput;
    };
  };
}
