import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetPublicAccessBlockOutput, GetPublicAccessBlockRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetPublicAccessBlockCommandInput extends GetPublicAccessBlockRequest {}
export interface GetPublicAccessBlockCommandOutput
  extends GetPublicAccessBlockOutput, __MetadataBearer {}
declare const GetPublicAccessBlockCommand_base: {
  new (
    input: GetPublicAccessBlockCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetPublicAccessBlockCommandInput,
    GetPublicAccessBlockCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetPublicAccessBlockCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetPublicAccessBlockCommandInput,
    GetPublicAccessBlockCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetPublicAccessBlockCommand extends GetPublicAccessBlockCommand_base {
  protected static __types: {
    api: {
      input: GetPublicAccessBlockRequest;
      output: GetPublicAccessBlockOutput;
    };
    sdk: {
      input: GetPublicAccessBlockCommandInput;
      output: GetPublicAccessBlockCommandOutput;
    };
  };
}
