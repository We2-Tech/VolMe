import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketOwnershipControlsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketOwnershipControlsCommandInput extends DeleteBucketOwnershipControlsRequest {}
export interface DeleteBucketOwnershipControlsCommandOutput extends __MetadataBearer {}
declare const DeleteBucketOwnershipControlsCommand_base: {
  new (
    input: DeleteBucketOwnershipControlsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketOwnershipControlsCommandInput,
    DeleteBucketOwnershipControlsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketOwnershipControlsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketOwnershipControlsCommandInput,
    DeleteBucketOwnershipControlsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketOwnershipControlsCommand extends DeleteBucketOwnershipControlsCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketOwnershipControlsRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketOwnershipControlsCommandInput;
      output: DeleteBucketOwnershipControlsCommandOutput;
    };
  };
}
