import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetObjectTaggingOutput, GetObjectTaggingRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectTaggingCommandInput extends GetObjectTaggingRequest {}
export interface GetObjectTaggingCommandOutput extends GetObjectTaggingOutput, __MetadataBearer {}
declare const GetObjectTaggingCommand_base: {
  new (
    input: GetObjectTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectTaggingCommandInput,
    GetObjectTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectTaggingCommandInput,
    GetObjectTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectTaggingCommand extends GetObjectTaggingCommand_base {
  protected static __types: {
    api: {
      input: GetObjectTaggingRequest;
      output: GetObjectTaggingOutput;
    };
    sdk: {
      input: GetObjectTaggingCommandInput;
      output: GetObjectTaggingCommandOutput;
    };
  };
}
