import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketLocationOutput, GetBucketLocationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketLocationCommandInput extends GetBucketLocationRequest {}
export interface GetBucketLocationCommandOutput extends GetBucketLocationOutput, __MetadataBearer {}
declare const GetBucketLocationCommand_base: {
  new (
    input: GetBucketLocationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketLocationCommandInput,
    GetBucketLocationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketLocationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketLocationCommandInput,
    GetBucketLocationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketLocationCommand extends GetBucketLocationCommand_base {
  protected static __types: {
    api: {
      input: GetBucketLocationRequest;
      output: GetBucketLocationOutput;
    };
    sdk: {
      input: GetBucketLocationCommandInput;
      output: GetBucketLocationCommandOutput;
    };
  };
}
