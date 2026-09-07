import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListObjectsOutput, ListObjectsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface ListObjectsCommandInput extends ListObjectsRequest {}
export interface ListObjectsCommandOutput extends ListObjectsOutput, __MetadataBearer {}
declare const ListObjectsCommand_base: {
  new (
    input: ListObjectsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListObjectsCommandInput,
    ListObjectsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListObjectsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListObjectsCommandInput,
    ListObjectsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListObjectsCommand extends ListObjectsCommand_base {
  protected static __types: {
    api: {
      input: ListObjectsRequest;
      output: ListObjectsOutput;
    };
    sdk: {
      input: ListObjectsCommandInput;
      output: ListObjectsCommandOutput;
    };
  };
}
