import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutObjectAclOutput, PutObjectAclRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutObjectAclCommandInput extends PutObjectAclRequest {}
export interface PutObjectAclCommandOutput extends PutObjectAclOutput, __MetadataBearer {}
declare const PutObjectAclCommand_base: {
  new (
    input: PutObjectAclCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectAclCommandInput,
    PutObjectAclCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutObjectAclCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectAclCommandInput,
    PutObjectAclCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutObjectAclCommand extends PutObjectAclCommand_base {
  protected static __types: {
    api: {
      input: PutObjectAclRequest;
      output: PutObjectAclOutput;
    };
    sdk: {
      input: PutObjectAclCommandInput;
      output: PutObjectAclCommandOutput;
    };
  };
}
