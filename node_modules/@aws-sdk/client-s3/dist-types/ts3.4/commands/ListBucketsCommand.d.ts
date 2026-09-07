import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListBucketsOutput, ListBucketsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface ListBucketsCommandInput extends ListBucketsRequest {}
export interface ListBucketsCommandOutput extends ListBucketsOutput, __MetadataBearer {}
declare const ListBucketsCommand_base: {
  new (
    input: ListBucketsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListBucketsCommandInput,
    ListBucketsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListBucketsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListBucketsCommandInput,
    ListBucketsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListBucketsCommand extends ListBucketsCommand_base {
  protected static __types: {
    api: {
      input: ListBucketsRequest;
      output: ListBucketsOutput;
    };
    sdk: {
      input: ListBucketsCommandInput;
      output: ListBucketsCommandOutput;
    };
  };
}
