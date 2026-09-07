import { MetadataBearer as __MetadataBearer, StreamingBlobPayloadInputTypes } from "@smithy/types";
import { WriteGetObjectResponseRequest } from "../models/models_1";
export { __MetadataBearer };
export interface WriteGetObjectResponseCommandInput extends Pick<
  WriteGetObjectResponseRequest,
  Exclude<keyof WriteGetObjectResponseRequest, "Body">
> {
  Body?: StreamingBlobPayloadInputTypes;
}
export interface WriteGetObjectResponseCommandOutput extends __MetadataBearer {}
declare const WriteGetObjectResponseCommand_base: {
  new (
    input: WriteGetObjectResponseCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    WriteGetObjectResponseCommandInput,
    WriteGetObjectResponseCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: WriteGetObjectResponseCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    WriteGetObjectResponseCommandInput,
    WriteGetObjectResponseCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class WriteGetObjectResponseCommand extends WriteGetObjectResponseCommand_base {
  protected static __types: {
    api: {
      input: WriteGetObjectResponseRequest;
      output: {};
    };
    sdk: {
      input: WriteGetObjectResponseCommandInput;
      output: WriteGetObjectResponseCommandOutput;
    };
  };
}
