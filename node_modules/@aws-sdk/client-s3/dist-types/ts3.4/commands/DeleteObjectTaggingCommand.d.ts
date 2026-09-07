import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteObjectTaggingOutput, DeleteObjectTaggingRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteObjectTaggingCommandInput extends DeleteObjectTaggingRequest {}
export interface DeleteObjectTaggingCommandOutput
  extends DeleteObjectTaggingOutput, __MetadataBearer {}
declare const DeleteObjectTaggingCommand_base: {
  new (
    input: DeleteObjectTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteObjectTaggingCommandInput,
    DeleteObjectTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteObjectTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteObjectTaggingCommandInput,
    DeleteObjectTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteObjectTaggingCommand extends DeleteObjectTaggingCommand_base {
  protected static __types: {
    api: {
      input: DeleteObjectTaggingRequest;
      output: DeleteObjectTaggingOutput;
    };
    sdk: {
      input: DeleteObjectTaggingCommandInput;
      output: DeleteObjectTaggingCommandOutput;
    };
  };
}
