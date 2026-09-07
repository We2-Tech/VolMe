import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListPartsOutput, ListPartsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface ListPartsCommandInput extends ListPartsRequest {}
export interface ListPartsCommandOutput extends ListPartsOutput, __MetadataBearer {}
declare const ListPartsCommand_base: {
  new (
    input: ListPartsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListPartsCommandInput,
    ListPartsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListPartsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListPartsCommandInput,
    ListPartsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListPartsCommand extends ListPartsCommand_base {
  protected static __types: {
    api: {
      input: ListPartsRequest;
      output: ListPartsOutput;
    };
    sdk: {
      input: ListPartsCommandInput;
      output: ListPartsCommandOutput;
    };
  };
}
