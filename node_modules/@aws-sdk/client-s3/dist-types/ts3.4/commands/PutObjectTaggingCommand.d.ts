import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutObjectTaggingOutput, PutObjectTaggingRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutObjectTaggingCommandInput extends PutObjectTaggingRequest {}
export interface PutObjectTaggingCommandOutput extends PutObjectTaggingOutput, __MetadataBearer {}
declare const PutObjectTaggingCommand_base: {
  new (
    input: PutObjectTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectTaggingCommandInput,
    PutObjectTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutObjectTaggingCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectTaggingCommandInput,
    PutObjectTaggingCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutObjectTaggingCommand extends PutObjectTaggingCommand_base {
  protected static __types: {
    api: {
      input: PutObjectTaggingRequest;
      output: PutObjectTaggingOutput;
    };
    sdk: {
      input: PutObjectTaggingCommandInput;
      output: PutObjectTaggingCommandOutput;
    };
  };
}
