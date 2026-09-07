import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketLoggingRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketLoggingCommandInput extends PutBucketLoggingRequest {}
export interface PutBucketLoggingCommandOutput extends __MetadataBearer {}
declare const PutBucketLoggingCommand_base: {
  new (
    input: PutBucketLoggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketLoggingCommandInput,
    PutBucketLoggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketLoggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketLoggingCommandInput,
    PutBucketLoggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketLoggingCommand extends PutBucketLoggingCommand_base {
  protected static __types: {
    api: {
      input: PutBucketLoggingRequest;
      output: {};
    };
    sdk: {
      input: PutBucketLoggingCommandInput;
      output: PutBucketLoggingCommandOutput;
    };
  };
}
