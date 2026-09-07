import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutPublicAccessBlockRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutPublicAccessBlockCommandInput extends PutPublicAccessBlockRequest {}
export interface PutPublicAccessBlockCommandOutput extends __MetadataBearer {}
declare const PutPublicAccessBlockCommand_base: {
  new (
    input: PutPublicAccessBlockCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutPublicAccessBlockCommandInput,
    PutPublicAccessBlockCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutPublicAccessBlockCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutPublicAccessBlockCommandInput,
    PutPublicAccessBlockCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutPublicAccessBlockCommand extends PutPublicAccessBlockCommand_base {
  protected static __types: {
    api: {
      input: PutPublicAccessBlockRequest;
      output: {};
    };
    sdk: {
      input: PutPublicAccessBlockCommandInput;
      output: PutPublicAccessBlockCommandOutput;
    };
  };
}
