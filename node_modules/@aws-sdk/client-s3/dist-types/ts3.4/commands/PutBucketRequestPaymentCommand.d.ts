import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketRequestPaymentRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketRequestPaymentCommandInput extends PutBucketRequestPaymentRequest {}
export interface PutBucketRequestPaymentCommandOutput extends __MetadataBearer {}
declare const PutBucketRequestPaymentCommand_base: {
  new (
    input: PutBucketRequestPaymentCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketRequestPaymentCommandInput,
    PutBucketRequestPaymentCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketRequestPaymentCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketRequestPaymentCommandInput,
    PutBucketRequestPaymentCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketRequestPaymentCommand extends PutBucketRequestPaymentCommand_base {
  protected static __types: {
    api: {
      input: PutBucketRequestPaymentRequest;
      output: {};
    };
    sdk: {
      input: PutBucketRequestPaymentCommandInput;
      output: PutBucketRequestPaymentCommandOutput;
    };
  };
}
