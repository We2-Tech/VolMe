import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketReplicationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketReplicationCommandInput extends DeleteBucketReplicationRequest {}
export interface DeleteBucketReplicationCommandOutput extends __MetadataBearer {}
declare const DeleteBucketReplicationCommand_base: {
  new (
    input: DeleteBucketReplicationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketReplicationCommandInput,
    DeleteBucketReplicationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketReplicationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketReplicationCommandInput,
    DeleteBucketReplicationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketReplicationCommand extends DeleteBucketReplicationCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketReplicationRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketReplicationCommandInput;
      output: DeleteBucketReplicationCommandOutput;
    };
  };
}
