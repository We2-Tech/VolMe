import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListObjectAnnotationsOutput, ListObjectAnnotationsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface ListObjectAnnotationsCommandInput extends ListObjectAnnotationsRequest {}
export interface ListObjectAnnotationsCommandOutput
  extends ListObjectAnnotationsOutput, __MetadataBearer {}
declare const ListObjectAnnotationsCommand_base: {
  new (
    input: ListObjectAnnotationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListObjectAnnotationsCommandInput,
    ListObjectAnnotationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListObjectAnnotationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListObjectAnnotationsCommandInput,
    ListObjectAnnotationsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListObjectAnnotationsCommand extends ListObjectAnnotationsCommand_base {
  protected static __types: {
    api: {
      input: ListObjectAnnotationsRequest;
      output: ListObjectAnnotationsOutput;
    };
    sdk: {
      input: ListObjectAnnotationsCommandInput;
      output: ListObjectAnnotationsCommandOutput;
    };
  };
}
