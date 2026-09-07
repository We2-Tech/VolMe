import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateSessionOutput, CreateSessionRequest } from "../models/models_0";
export { __MetadataBearer };
export interface CreateSessionCommandInput extends CreateSessionRequest {}
export interface CreateSessionCommandOutput extends CreateSessionOutput, __MetadataBearer {}
declare const CreateSessionCommand_base: {
  new (
    input: CreateSessionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateSessionCommandInput,
    CreateSessionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateSessionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateSessionCommandInput,
    CreateSessionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateSessionCommand extends CreateSessionCommand_base {
  protected static __types: {
    api: {
      input: CreateSessionRequest;
      output: CreateSessionOutput;
    };
    sdk: {
      input: CreateSessionCommandInput;
      output: CreateSessionCommandOutput;
    };
  };
}
