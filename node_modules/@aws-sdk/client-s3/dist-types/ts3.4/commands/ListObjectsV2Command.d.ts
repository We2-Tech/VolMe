import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListObjectsV2Output, ListObjectsV2Request } from "../models/models_0";
export { __MetadataBearer };
export interface ListObjectsV2CommandInput extends ListObjectsV2Request {}
export interface ListObjectsV2CommandOutput extends ListObjectsV2Output, __MetadataBearer {}
declare const ListObjectsV2Command_base: {
  new (
    input: ListObjectsV2CommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListObjectsV2CommandInput,
    ListObjectsV2CommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListObjectsV2CommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListObjectsV2CommandInput,
    ListObjectsV2CommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListObjectsV2Command extends ListObjectsV2Command_base {
  protected static __types: {
    api: {
      input: ListObjectsV2Request;
      output: ListObjectsV2Output;
    };
    sdk: {
      input: ListObjectsV2CommandInput;
      output: ListObjectsV2CommandOutput;
    };
  };
}
