import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetObjectAclOutput, GetObjectAclRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectAclCommandInput extends GetObjectAclRequest {}
export interface GetObjectAclCommandOutput extends GetObjectAclOutput, __MetadataBearer {}
declare const GetObjectAclCommand_base: {
  new (
    input: GetObjectAclCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectAclCommandInput,
    GetObjectAclCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectAclCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectAclCommandInput,
    GetObjectAclCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectAclCommand extends GetObjectAclCommand_base {
  protected static __types: {
    api: {
      input: GetObjectAclRequest;
      output: GetObjectAclOutput;
    };
    sdk: {
      input: GetObjectAclCommandInput;
      output: GetObjectAclCommandOutput;
    };
  };
}
