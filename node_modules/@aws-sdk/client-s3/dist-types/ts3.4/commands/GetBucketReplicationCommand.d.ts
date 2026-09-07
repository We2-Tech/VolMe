import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketReplicationOutput, GetBucketReplicationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketReplicationCommandInput extends GetBucketReplicationRequest {}
export interface GetBucketReplicationCommandOutput
  extends GetBucketReplicationOutput, __MetadataBearer {}
declare const GetBucketReplicationCommand_base: {
  new (
    input: GetBucketReplicationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketReplicationCommandInput,
    GetBucketReplicationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketReplicationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketReplicationCommandInput,
    GetBucketReplicationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketReplicationCommand extends GetBucketReplicationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketReplicationRequest;
      output: GetBucketReplicationOutput;
    };
    sdk: {
      input: GetBucketReplicationCommandInput;
      output: GetBucketReplicationCommandOutput;
    };
  };
}
