import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteObjectOutput, DeleteObjectRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteObjectCommandInput extends DeleteObjectRequest {}
export interface DeleteObjectCommandOutput extends DeleteObjectOutput, __MetadataBearer {}
declare const DeleteObjectCommand_base: {
  new (
    input: DeleteObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteObjectCommandInput,
    DeleteObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteObjectCommandInput,
    DeleteObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteObjectCommand extends DeleteObjectCommand_base {
  protected static __types: {
    api: {
      input: DeleteObjectRequest;
      output: DeleteObjectOutput;
    };
    sdk: {
      input: DeleteObjectCommandInput;
      output: DeleteObjectCommandOutput;
    };
  };
}
