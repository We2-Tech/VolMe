import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CopyObjectOutput, CopyObjectRequest } from "../models/models_0";
export { __MetadataBearer };
export interface CopyObjectCommandInput extends CopyObjectRequest {}
export interface CopyObjectCommandOutput extends CopyObjectOutput, __MetadataBearer {}
declare const CopyObjectCommand_base: {
  new (
    input: CopyObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CopyObjectCommandInput,
    CopyObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CopyObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CopyObjectCommandInput,
    CopyObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CopyObjectCommand extends CopyObjectCommand_base {
  protected static __types: {
    api: {
      input: CopyObjectRequest;
      output: CopyObjectOutput;
    };
    sdk: {
      input: CopyObjectCommandInput;
      output: CopyObjectCommandOutput;
    };
  };
}
