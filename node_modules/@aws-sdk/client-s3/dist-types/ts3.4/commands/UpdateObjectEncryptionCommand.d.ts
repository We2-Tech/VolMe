import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UpdateObjectEncryptionRequest, UpdateObjectEncryptionResponse } from "../models/models_1";
export { __MetadataBearer };
export interface UpdateObjectEncryptionCommandInput extends UpdateObjectEncryptionRequest {}
export interface UpdateObjectEncryptionCommandOutput
  extends UpdateObjectEncryptionResponse, __MetadataBearer {}
declare const UpdateObjectEncryptionCommand_base: {
  new (
    input: UpdateObjectEncryptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateObjectEncryptionCommandInput,
    UpdateObjectEncryptionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateObjectEncryptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateObjectEncryptionCommandInput,
    UpdateObjectEncryptionCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateObjectEncryptionCommand extends UpdateObjectEncryptionCommand_base {
  protected static __types: {
    api: {
      input: UpdateObjectEncryptionRequest;
      output: UpdateObjectEncryptionResponse;
    };
    sdk: {
      input: UpdateObjectEncryptionCommandInput;
      output: UpdateObjectEncryptionCommandOutput;
    };
  };
}
