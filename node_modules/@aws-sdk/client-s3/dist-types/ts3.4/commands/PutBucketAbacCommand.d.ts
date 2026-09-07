import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketAbacRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketAbacCommandInput extends PutBucketAbacRequest {}
export interface PutBucketAbacCommandOutput extends __MetadataBearer {}
declare const PutBucketAbacCommand_base: {
  new (
    input: PutBucketAbacCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketAbacCommandInput,
    PutBucketAbacCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketAbacCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketAbacCommandInput,
    PutBucketAbacCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketAbacCommand extends PutBucketAbacCommand_base {
  protected static __types: {
    api: {
      input: PutBucketAbacRequest;
      output: {};
    };
    sdk: {
      input: PutBucketAbacCommandInput;
      output: PutBucketAbacCommandOutput;
    };
  };
}
