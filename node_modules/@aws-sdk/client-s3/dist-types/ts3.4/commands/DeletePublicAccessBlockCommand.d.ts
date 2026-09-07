import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeletePublicAccessBlockRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeletePublicAccessBlockCommandInput extends DeletePublicAccessBlockRequest {}
export interface DeletePublicAccessBlockCommandOutput extends __MetadataBearer {}
declare const DeletePublicAccessBlockCommand_base: {
  new (
    input: DeletePublicAccessBlockCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeletePublicAccessBlockCommandInput,
    DeletePublicAccessBlockCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeletePublicAccessBlockCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeletePublicAccessBlockCommandInput,
    DeletePublicAccessBlockCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeletePublicAccessBlockCommand extends DeletePublicAccessBlockCommand_base {
  protected static __types: {
    api: {
      input: DeletePublicAccessBlockRequest;
      output: {};
    };
    sdk: {
      input: DeletePublicAccessBlockCommandInput;
      output: DeletePublicAccessBlockCommandOutput;
    };
  };
}
