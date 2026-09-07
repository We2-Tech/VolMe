import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteObjectAnnotationOutput, DeleteObjectAnnotationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteObjectAnnotationCommandInput extends DeleteObjectAnnotationRequest {}
export interface DeleteObjectAnnotationCommandOutput
  extends DeleteObjectAnnotationOutput, __MetadataBearer {}
declare const DeleteObjectAnnotationCommand_base: {
  new (
    input: DeleteObjectAnnotationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteObjectAnnotationCommandInput,
    DeleteObjectAnnotationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteObjectAnnotationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteObjectAnnotationCommandInput,
    DeleteObjectAnnotationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteObjectAnnotationCommand extends DeleteObjectAnnotationCommand_base {
  protected static __types: {
    api: {
      input: DeleteObjectAnnotationRequest;
      output: DeleteObjectAnnotationOutput;
    };
    sdk: {
      input: DeleteObjectAnnotationCommandInput;
      output: DeleteObjectAnnotationCommandOutput;
    };
  };
}
