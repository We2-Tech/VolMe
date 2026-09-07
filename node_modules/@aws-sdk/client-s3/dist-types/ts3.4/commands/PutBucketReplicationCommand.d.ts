import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketReplicationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketReplicationCommandInput extends PutBucketReplicationRequest {}
export interface PutBucketReplicationCommandOutput extends __MetadataBearer {}
declare const PutBucketReplicationCommand_base: {
  new (
    input: PutBucketReplicationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketReplicationCommandInput,
    PutBucketReplicationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketReplicationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketReplicationCommandInput,
    PutBucketReplicationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketReplicationCommand extends PutBucketReplicationCommand_base {
  protected static __types: {
    api: {
      input: PutBucketReplicationRequest;
      output: {};
    };
    sdk: {
      input: PutBucketReplicationCommandInput;
      output: PutBucketReplicationCommandOutput;
    };
  };
}
