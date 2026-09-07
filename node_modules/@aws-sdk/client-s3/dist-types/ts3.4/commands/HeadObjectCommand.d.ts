import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { HeadObjectOutput, HeadObjectRequest } from "../models/models_0";
export { __MetadataBearer };
export interface HeadObjectCommandInput extends HeadObjectRequest {}
export interface HeadObjectCommandOutput extends HeadObjectOutput, __MetadataBearer {}
declare const HeadObjectCommand_base: {
  new (
    input: HeadObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    HeadObjectCommandInput,
    HeadObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: HeadObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    HeadObjectCommandInput,
    HeadObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class HeadObjectCommand extends HeadObjectCommand_base {
  protected static __types: {
    api: {
      input: HeadObjectRequest;
      output: HeadObjectOutput;
    };
    sdk: {
      input: HeadObjectCommandInput;
      output: HeadObjectCommandOutput;
    };
  };
}
