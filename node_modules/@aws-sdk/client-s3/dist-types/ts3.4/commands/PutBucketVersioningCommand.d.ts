import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketVersioningRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketVersioningCommandInput extends PutBucketVersioningRequest {}
export interface PutBucketVersioningCommandOutput extends __MetadataBearer {}
declare const PutBucketVersioningCommand_base: {
  new (
    input: PutBucketVersioningCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketVersioningCommandInput,
    PutBucketVersioningCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketVersioningCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketVersioningCommandInput,
    PutBucketVersioningCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketVersioningCommand extends PutBucketVersioningCommand_base {
  protected static __types: {
    api: {
      input: PutBucketVersioningRequest;
      output: {};
    };
    sdk: {
      input: PutBucketVersioningCommandInput;
      output: PutBucketVersioningCommandOutput;
    };
  };
}
