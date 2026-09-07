import { MetadataBearer as __MetadataBearer, StreamingBlobPayloadInputTypes } from "@smithy/types";
import { PutObjectAnnotationOutput, PutObjectAnnotationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface PutObjectAnnotationCommandInput extends Pick<
  PutObjectAnnotationRequest,
  Exclude<keyof PutObjectAnnotationRequest, "AnnotationPayload">
> {
  AnnotationPayload: StreamingBlobPayloadInputTypes;
}
export interface PutObjectAnnotationCommandOutput
  extends PutObjectAnnotationOutput, __MetadataBearer {}
declare const PutObjectAnnotationCommand_base: {
  new (
    input: PutObjectAnnotationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectAnnotationCommandInput,
    PutObjectAnnotationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutObjectAnnotationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutObjectAnnotationCommandInput,
    PutObjectAnnotationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutObjectAnnotationCommand extends PutObjectAnnotationCommand_base {
  protected static __types: {
    api: {
      input: PutObjectAnnotationRequest;
      output: PutObjectAnnotationOutput;
    };
    sdk: {
      input: PutObjectAnnotationCommandInput;
      output: PutObjectAnnotationCommandOutput;
    };
  };
}
