import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { SelectObjectContentOutput, SelectObjectContentRequest } from "../models/models_1";
export { __MetadataBearer };
export interface SelectObjectContentCommandInput extends SelectObjectContentRequest {}
export interface SelectObjectContentCommandOutput
  extends SelectObjectContentOutput, __MetadataBearer {}
declare const SelectObjectContentCommand_base: {
  new (
    input: SelectObjectContentCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    SelectObjectContentCommandInput,
    SelectObjectContentCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: SelectObjectContentCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    SelectObjectContentCommandInput,
    SelectObjectContentCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class SelectObjectContentCommand extends SelectObjectContentCommand_base {
  protected static __types: {
    api: {
      input: SelectObjectContentRequest;
      output: SelectObjectContentOutput;
    };
    sdk: {
      input: SelectObjectContentCommandInput;
      output: SelectObjectContentCommandOutput;
    };
  };
}
