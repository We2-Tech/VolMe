import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutObjectRetentionOutput, PutObjectRetentionRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutObjectRetentionCommandInput extends PutObjectRetentionRequest {}
export interface PutObjectRetentionCommandOutput
  extends PutObjectRetentionOutput, __MetadataBearer {}
declare const PutObjectRetentionCommand_base: {
  new (
    input: PutObjectRetentionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectRetentionCommandInput,
    PutObjectRetentionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutObjectRetentionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectRetentionCommandInput,
    PutObjectRetentionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutObjectRetentionCommand extends PutObjectRetentionCommand_base {
  protected static __types: {
    api: {
      input: PutObjectRetentionRequest;
      output: PutObjectRetentionOutput;
    };
    sdk: {
      input: PutObjectRetentionCommandInput;
      output: PutObjectRetentionCommandOutput;
    };
  };
}
