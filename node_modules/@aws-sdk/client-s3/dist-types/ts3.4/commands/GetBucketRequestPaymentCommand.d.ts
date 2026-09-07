import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketRequestPaymentOutput, GetBucketRequestPaymentRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketRequestPaymentCommandInput extends GetBucketRequestPaymentRequest {}
export interface GetBucketRequestPaymentCommandOutput
  extends GetBucketRequestPaymentOutput, __MetadataBearer {}
declare const GetBucketRequestPaymentCommand_base: {
  new (
    input: GetBucketRequestPaymentCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketRequestPaymentCommandInput,
    GetBucketRequestPaymentCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketRequestPaymentCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketRequestPaymentCommandInput,
    GetBucketRequestPaymentCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketRequestPaymentCommand extends GetBucketRequestPaymentCommand_base {
  protected static __types: {
    api: {
      input: GetBucketRequestPaymentRequest;
      output: GetBucketRequestPaymentOutput;
    };
    sdk: {
      input: GetBucketRequestPaymentCommandInput;
      output: GetBucketRequestPaymentCommandOutput;
    };
  };
}
