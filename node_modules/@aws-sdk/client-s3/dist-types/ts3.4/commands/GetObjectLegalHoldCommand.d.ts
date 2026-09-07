import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetObjectLegalHoldOutput, GetObjectLegalHoldRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectLegalHoldCommandInput extends GetObjectLegalHoldRequest {}
export interface GetObjectLegalHoldCommandOutput
  extends GetObjectLegalHoldOutput, __MetadataBearer {}
declare const GetObjectLegalHoldCommand_base: {
  new (
    input: GetObjectLegalHoldCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectLegalHoldCommandInput,
    GetObjectLegalHoldCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectLegalHoldCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectLegalHoldCommandInput,
    GetObjectLegalHoldCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectLegalHoldCommand extends GetObjectLegalHoldCommand_base {
  protected static __types: {
    api: {
      input: GetObjectLegalHoldRequest;
      output: GetObjectLegalHoldOutput;
    };
    sdk: {
      input: GetObjectLegalHoldCommandInput;
      output: GetObjectLegalHoldCommandOutput;
    };
  };
}
