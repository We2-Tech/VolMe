import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketCorsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketCorsCommandInput extends DeleteBucketCorsRequest {}
export interface DeleteBucketCorsCommandOutput extends __MetadataBearer {}
declare const DeleteBucketCorsCommand_base: {
  new (
    input: DeleteBucketCorsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketCorsCommandInput,
    DeleteBucketCorsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketCorsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketCorsCommandInput,
    DeleteBucketCorsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketCorsCommand extends DeleteBucketCorsCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketCorsRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketCorsCommandInput;
      output: DeleteBucketCorsCommandOutput;
    };
  };
}
