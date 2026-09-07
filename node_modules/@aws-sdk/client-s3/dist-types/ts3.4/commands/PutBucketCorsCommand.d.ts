import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketCorsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketCorsCommandInput extends PutBucketCorsRequest {}
export interface PutBucketCorsCommandOutput extends __MetadataBearer {}
declare const PutBucketCorsCommand_base: {
  new (
    input: PutBucketCorsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketCorsCommandInput,
    PutBucketCorsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketCorsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketCorsCommandInput,
    PutBucketCorsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketCorsCommand extends PutBucketCorsCommand_base {
  protected static __types: {
    api: {
      input: PutBucketCorsRequest;
      output: {};
    };
    sdk: {
      input: PutBucketCorsCommandInput;
      output: PutBucketCorsCommandOutput;
    };
  };
}
