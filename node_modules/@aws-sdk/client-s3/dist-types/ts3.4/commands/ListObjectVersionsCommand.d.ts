import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListObjectVersionsOutput, ListObjectVersionsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface ListObjectVersionsCommandInput extends ListObjectVersionsRequest {}
export interface ListObjectVersionsCommandOutput
  extends ListObjectVersionsOutput, __MetadataBearer {}
declare const ListObjectVersionsCommand_base: {
  new (
    input: ListObjectVersionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListObjectVersionsCommandInput,
    ListObjectVersionsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListObjectVersionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListObjectVersionsCommandInput,
    ListObjectVersionsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListObjectVersionsCommand extends ListObjectVersionsCommand_base {
  protected static __types: {
    api: {
      input: ListObjectVersionsRequest;
      output: ListObjectVersionsOutput;
    };
    sdk: {
      input: ListObjectVersionsCommandInput;
      output: ListObjectVersionsCommandOutput;
    };
  };
}
