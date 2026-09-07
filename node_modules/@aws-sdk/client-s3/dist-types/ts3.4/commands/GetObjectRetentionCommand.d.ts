import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetObjectRetentionOutput, GetObjectRetentionRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectRetentionCommandInput extends GetObjectRetentionRequest {}
export interface GetObjectRetentionCommandOutput
  extends GetObjectRetentionOutput, __MetadataBearer {}
declare const GetObjectRetentionCommand_base: {
  new (
    input: GetObjectRetentionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectRetentionCommandInput,
    GetObjectRetentionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectRetentionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectRetentionCommandInput,
    GetObjectRetentionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectRetentionCommand extends GetObjectRetentionCommand_base {
  protected static __types: {
    api: {
      input: GetObjectRetentionRequest;
      output: GetObjectRetentionOutput;
    };
    sdk: {
      input: GetObjectRetentionCommandInput;
      output: GetObjectRetentionCommandOutput;
    };
  };
}
