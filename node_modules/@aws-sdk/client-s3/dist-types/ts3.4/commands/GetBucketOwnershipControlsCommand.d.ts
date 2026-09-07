import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetBucketOwnershipControlsOutput,
  GetBucketOwnershipControlsRequest,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetBucketOwnershipControlsCommandInput extends GetBucketOwnershipControlsRequest {}
export interface GetBucketOwnershipControlsCommandOutput
  extends GetBucketOwnershipControlsOutput, __MetadataBearer {}
declare const GetBucketOwnershipControlsCommand_base: {
  new (
    input: GetBucketOwnershipControlsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketOwnershipControlsCommandInput,
    GetBucketOwnershipControlsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBucketOwnershipControlsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBucketOwnershipControlsCommandInput,
    GetBucketOwnershipControlsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBucketOwnershipControlsCommand extends GetBucketOwnershipControlsCommand_base {
  protected static __types: {
    api: {
      input: GetBucketOwnershipControlsRequest;
      output: GetBucketOwnershipControlsOutput;
    };
    sdk: {
      input: GetBucketOwnershipControlsCommandInput;
      output: GetBucketOwnershipControlsCommandOutput;
    };
  };
}
