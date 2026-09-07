import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketIntelligentTieringConfigurationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketIntelligentTieringConfigurationCommandInput extends DeleteBucketIntelligentTieringConfigurationRequest {}
export interface DeleteBucketIntelligentTieringConfigurationCommandOutput extends __MetadataBearer {}
declare const DeleteBucketIntelligentTieringConfigurationCommand_base: {
  new (
    input: DeleteBucketIntelligentTieringConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketIntelligentTieringConfigurationCommandInput,
    DeleteBucketIntelligentTieringConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketIntelligentTieringConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketIntelligentTieringConfigurationCommandInput,
    DeleteBucketIntelligentTieringConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketIntelligentTieringConfigurationCommand extends DeleteBucketIntelligentTieringConfigurationCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketIntelligentTieringConfigurationRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketIntelligentTieringConfigurationCommandInput;
      output: DeleteBucketIntelligentTieringConfigurationCommandOutput;
    };
  };
}
