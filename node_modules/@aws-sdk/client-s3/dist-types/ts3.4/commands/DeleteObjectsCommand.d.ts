import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteObjectsOutput, DeleteObjectsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteObjectsCommandInput extends DeleteObjectsRequest {}
export interface DeleteObjectsCommandOutput extends DeleteObjectsOutput, __MetadataBearer {}
declare const DeleteObjectsCommand_base: {
  new (
    input: DeleteObjectsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteObjectsCommandInput,
    DeleteObjectsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteObjectsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteObjectsCommandInput,
    DeleteObjectsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteObjectsCommand extends DeleteObjectsCommand_base {
  protected static __types: {
    api: {
      input: DeleteObjectsRequest;
      output: DeleteObjectsOutput;
    };
    sdk: {
      input: DeleteObjectsCommandInput;
      output: DeleteObjectsCommandOutput;
    };
  };
}
