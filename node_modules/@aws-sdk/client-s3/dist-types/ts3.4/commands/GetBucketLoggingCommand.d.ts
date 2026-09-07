import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketLoggingOutput, GetBucketLoggingRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketLoggingCommandInput extends GetBucketLoggingRequest {}
export interface GetBucketLoggingCommandOutput extends GetBucketLoggingOutput, __MetadataBearer {}
declare const GetBucketLoggingCommand_base: {
  new (
    input: GetBucketLoggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketLoggingCommandInput,
    GetBucketLoggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketLoggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketLoggingCommandInput,
    GetBucketLoggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketLoggingCommand extends GetBucketLoggingCommand_base {
  protected static __types: {
    api: {
      input: GetBucketLoggingRequest;
      output: GetBucketLoggingOutput;
    };
    sdk: {
      input: GetBucketLoggingCommandInput;
      output: GetBucketLoggingCommandOutput;
    };
  };
}
