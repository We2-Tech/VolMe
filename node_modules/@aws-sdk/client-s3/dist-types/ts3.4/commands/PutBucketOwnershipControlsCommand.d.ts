import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutBucketOwnershipControlsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutBucketOwnershipControlsCommandInput extends PutBucketOwnershipControlsRequest {}
export interface PutBucketOwnershipControlsCommandOutput extends __MetadataBearer {}
declare const PutBucketOwnershipControlsCommand_base: {
  new (
    input: PutBucketOwnershipControlsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketOwnershipControlsCommandInput,
    PutBucketOwnershipControlsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutBucketOwnershipControlsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutBucketOwnershipControlsCommandInput,
    PutBucketOwnershipControlsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutBucketOwnershipControlsCommand extends PutBucketOwnershipControlsCommand_base {
  protected static __types: {
    api: {
      input: PutBucketOwnershipControlsRequest;
      output: {};
    };
    sdk: {
      input: PutBucketOwnershipControlsCommandInput;
      output: PutBucketOwnershipControlsCommandOutput;
    };
  };
}
