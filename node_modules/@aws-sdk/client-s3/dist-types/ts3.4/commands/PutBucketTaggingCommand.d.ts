import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketTaggingRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketTaggingCommandInput extends PutBucketTaggingRequest {}
export interface PutBucketTaggingCommandOutput extends __MetadataBearer {}
declare const PutBucketTaggingCommand_base: {
  new (
    input: PutBucketTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketTaggingCommandInput,
    PutBucketTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketTaggingCommandInput,
    PutBucketTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketTaggingCommand extends PutBucketTaggingCommand_base {
  protected static __types: {
    api: {
      input: PutBucketTaggingRequest;
      output: {};
    };
    sdk: {
      input: PutBucketTaggingCommandInput;
      output: PutBucketTaggingCommandOutput;
    };
  };
}
