import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutObjectLegalHoldOutput, PutObjectLegalHoldRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutObjectLegalHoldCommandInput extends PutObjectLegalHoldRequest {}
export interface PutObjectLegalHoldCommandOutput
  extends PutObjectLegalHoldOutput, __MetadataBearer {}
declare const PutObjectLegalHoldCommand_base: {
  new (
    input: PutObjectLegalHoldCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectLegalHoldCommandInput,
    PutObjectLegalHoldCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutObjectLegalHoldCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectLegalHoldCommandInput,
    PutObjectLegalHoldCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutObjectLegalHoldCommand extends PutObjectLegalHoldCommand_base {
  protected static __types: {
    api: {
      input: PutObjectLegalHoldRequest;
      output: PutObjectLegalHoldOutput;
    };
    sdk: {
      input: PutObjectLegalHoldCommandInput;
      output: PutObjectLegalHoldCommandOutput;
    };
  };
}
