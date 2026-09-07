import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { RestoreObjectOutput, RestoreObjectRequest } from "../models/models_1";
export { __MetadataBearer };
export interface RestoreObjectCommandInput extends RestoreObjectRequest {}
export interface RestoreObjectCommandOutput extends RestoreObjectOutput, __MetadataBearer {}
declare const RestoreObjectCommand_base: {
  new (
    input: RestoreObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    RestoreObjectCommandInput,
    RestoreObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: RestoreObjectCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    RestoreObjectCommandInput,
    RestoreObjectCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class RestoreObjectCommand extends RestoreObjectCommand_base {
  protected static __types: {
    api: {
      input: RestoreObjectRequest;
      output: RestoreObjectOutput;
    };
    sdk: {
      input: RestoreObjectCommandInput;
      output: RestoreObjectCommandOutput;
    };
  };
}
