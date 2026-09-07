import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UpdateBucketMetadataJournalTableConfigurationRequest } from "../models/models_1";
export { __MetadataBearer };
export interface UpdateBucketMetadataJournalTableConfigurationCommandInput extends UpdateBucketMetadataJournalTableConfigurationRequest {}
export interface UpdateBucketMetadataJournalTableConfigurationCommandOutput extends __MetadataBearer {}
declare const UpdateBucketMetadataJournalTableConfigurationCommand_base: {
  new (
    input: UpdateBucketMetadataJournalTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateBucketMetadataJournalTableConfigurationCommandInput,
    UpdateBucketMetadataJournalTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateBucketMetadataJournalTableConfigurationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateBucketMetadataJournalTableConfigurationCommandInput,
    UpdateBucketMetadataJournalTableConfigurationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateBucketMetadataJournalTableConfigurationCommand extends UpdateBucketMetadataJournalTableConfigurationCommand_base {
  protected static __types: {
    api: {
      input: UpdateBucketMetadataJournalTableConfigurationRequest;
      output: {};
    };
    sdk: {
      input: UpdateBucketMetadataJournalTableConfigurationCommandInput;
      output: UpdateBucketMetadataJournalTableConfigurationCommandOutput;
    };
  };
}
