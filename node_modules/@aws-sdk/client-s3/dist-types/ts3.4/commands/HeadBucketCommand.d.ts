import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { HeadBucketOutput, HeadBucketRequest } from "../models/models_0";
export { __MetadataBearer };
export interface HeadBucketCommandInput extends HeadBucketRequest {}
export interface HeadBucketCommandOutput extends HeadBucketOutput, __MetadataBearer {}
declare const HeadBucketCommand_base: {
  new (
    input: HeadBucketCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    HeadBucketCommandInput,
    HeadBucketCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: HeadBucketCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    HeadBucketCommandInput,
    HeadBucketCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class HeadBucketCommand extends HeadBucketCommand_base {
  protected static __types: {
    api: {
      input: HeadBucketRequest;
      output: HeadBucketOutput;
    };
    sdk: {
      input: HeadBucketCommandInput;
      output: HeadBucketCommandOutput;
    };
  };
}
