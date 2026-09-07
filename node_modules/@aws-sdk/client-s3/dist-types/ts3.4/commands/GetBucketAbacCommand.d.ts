import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBucketAbacOutput, GetBucketAbacRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketAbacCommandInput extends GetBucketAbacRequest {}
export interface GetBucketAbacCommandOutput extends GetBucketAbacOutput, __MetadataBearer {}
declare const GetBucketAbacCommand_base: {
  new (
    input: GetBucketAbacCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketAbacCommandInput,
    GetBucketAbacCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketAbacCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketAbacCommandInput,
    GetBucketAbacCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketAbacCommand extends GetBucketAbacCommand_base {
  protected static __types: {
    api: {
      input: GetBucketAbacRequest;
      output: GetBucketAbacOutput;
    };
    sdk: {
      input: GetBucketAbacCommandInput;
      output: GetBucketAbacCommandOutput;
    };
  };
}
