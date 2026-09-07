import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetObjectAttributesOutput, GetObjectAttributesRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectAttributesCommandInput extends GetObjectAttributesRequest {}
export interface GetObjectAttributesCommandOutput
  extends GetObjectAttributesOutput, __MetadataBearer {}
declare const GetObjectAttributesCommand_base: {
  new (
    input: GetObjectAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectAttributesCommandInput,
    GetObjectAttributesCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectAttributesCommandInput,
    GetObjectAttributesCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectAttributesCommand extends GetObjectAttributesCommand_base {
  protected static __types: {
    api: {
      input: GetObjectAttributesRequest;
      output: GetObjectAttributesOutput;
    };
    sdk: {
      input: GetObjectAttributesCommandInput;
      output: GetObjectAttributesCommandOutput;
    };
  };
}
