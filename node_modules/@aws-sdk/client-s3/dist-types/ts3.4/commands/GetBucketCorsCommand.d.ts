import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketCorsOutput, GetBucketCorsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketCorsCommandInput extends GetBucketCorsRequest {}
export interface GetBucketCorsCommandOutput extends GetBucketCorsOutput, __MetadataBearer {}
declare const GetBucketCorsCommand_base: {
  new (
    input: GetBucketCorsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketCorsCommandInput,
    GetBucketCorsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketCorsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketCorsCommandInput,
    GetBucketCorsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketCorsCommand extends GetBucketCorsCommand_base {
  protected static __types: {
    api: {
      input: GetBucketCorsRequest;
      output: GetBucketCorsOutput;
    };
    sdk: {
      input: GetBucketCorsCommandInput;
      output: GetBucketCorsCommandOutput;
    };
  };
}
