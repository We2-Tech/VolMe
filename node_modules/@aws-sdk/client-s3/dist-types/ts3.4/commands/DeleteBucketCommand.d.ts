import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketCommandInput extends DeleteBucketRequest {}
export interface DeleteBucketCommandOutput extends __MetadataBearer {}
declare const DeleteBucketCommand_base: {
  new (
    input: DeleteBucketCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketCommandInput,
    DeleteBucketCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketCommandInput,
    DeleteBucketCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketCommand extends DeleteBucketCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketCommandInput;
      output: DeleteBucketCommandOutput;
    };
  };
}
