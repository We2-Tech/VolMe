import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListDirectoryBucketsOutput, ListDirectoryBucketsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface ListDirectoryBucketsCommandInput extends ListDirectoryBucketsRequest {}
export interface ListDirectoryBucketsCommandOutput
  extends ListDirectoryBucketsOutput, __MetadataBearer {}
declare const ListDirectoryBucketsCommand_base: {
  new (
    input: ListDirectoryBucketsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListDirectoryBucketsCommandInput,
    ListDirectoryBucketsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListDirectoryBucketsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListDirectoryBucketsCommandInput,
    ListDirectoryBucketsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListDirectoryBucketsCommand extends ListDirectoryBucketsCommand_base {
  protected static __types: {
    api: {
      input: ListDirectoryBucketsRequest;
      output: ListDirectoryBucketsOutput;
    };
    sdk: {
      input: ListDirectoryBucketsCommandInput;
      output: ListDirectoryBucketsCommandOutput;
    };
  };
}
