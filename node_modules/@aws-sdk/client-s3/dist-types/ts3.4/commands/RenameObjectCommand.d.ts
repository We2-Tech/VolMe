import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { RenameObjectOutput, RenameObjectRequest } from "../models/models_1";
export { __MetadataBearer };
export interface RenameObjectCommandInput extends RenameObjectRequest {}
export interface RenameObjectCommandOutput extends RenameObjectOutput, __MetadataBearer {}
declare const RenameObjectCommand_base: {
  new (
    input: RenameObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    RenameObjectCommandInput,
    RenameObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: RenameObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    RenameObjectCommandInput,
    RenameObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class RenameObjectCommand extends RenameObjectCommand_base {
  protected static __types: {
    api: {
      input: RenameObjectRequest;
      output: {};
    };
    sdk: {
      input: RenameObjectCommandInput;
      output: RenameObjectCommandOutput;
    };
  };
}
