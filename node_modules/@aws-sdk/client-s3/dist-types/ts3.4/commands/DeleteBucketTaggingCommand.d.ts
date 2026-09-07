import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketTaggingRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketTaggingCommandInput extends DeleteBucketTaggingRequest {}
export interface DeleteBucketTaggingCommandOutput extends __MetadataBearer {}
declare const DeleteBucketTaggingCommand_base: {
  new (
    input: DeleteBucketTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketTaggingCommandInput,
    DeleteBucketTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketTaggingCommandInput,
    DeleteBucketTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketTaggingCommand extends DeleteBucketTaggingCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketTaggingRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketTaggingCommandInput;
      output: DeleteBucketTaggingCommandOutput;
    };
  };
}
