import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListMultipartUploadsOutput, ListMultipartUploadsRequest } from "../models/models_0";
export { __MetadataBearer };
export interface ListMultipartUploadsCommandInput extends ListMultipartUploadsRequest {}
export interface ListMultipartUploadsCommandOutput
  extends ListMultipartUploadsOutput, __MetadataBearer {}
declare const ListMultipartUploadsCommand_base: {
  new (
    input: ListMultipartUploadsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListMultipartUploadsCommandInput,
    ListMultipartUploadsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListMultipartUploadsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListMultipartUploadsCommandInput,
    ListMultipartUploadsCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListMultipartUploadsCommand extends ListMultipartUploadsCommand_base {
  protected static __types: {
    api: {
      input: ListMultipartUploadsRequest;
      output: ListMultipartUploadsOutput;
    };
    sdk: {
      input: ListMultipartUploadsCommandInput;
      output: ListMultipartUploadsCommandOutput;
    };
  };
}
