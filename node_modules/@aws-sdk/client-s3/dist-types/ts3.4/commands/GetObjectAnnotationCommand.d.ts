import { MetadataBearer as __MetadataBearer, StreamingBlobPayloadOutputTypes } from "@smithy/types";
import { GetObjectAnnotationOutput, GetObjectAnnotationRequest } from "../models/models_0";
export { __MetadataBearer };
export interface GetObjectAnnotationCommandInput extends GetObjectAnnotationRequest {}
export interface GetObjectAnnotationCommandOutput
  extends
    Pick<GetObjectAnnotationOutput, Exclude<keyof GetObjectAnnotationOutput, "AnnotationPayload">>,
    __MetadataBearer {
  AnnotationPayload?: StreamingBlobPayloadOutputTypes;
}
declare const GetObjectAnnotationCommand_base: {
  new (
    input: GetObjectAnnotationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectAnnotationCommandInput,
    GetObjectAnnotationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetObjectAnnotationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetObjectAnnotationCommandInput,
    GetObjectAnnotationCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetObjectAnnotationCommand extends GetObjectAnnotationCommand_base {
  protected static __types: {
    api: {
      input: GetObjectAnnotationRequest;
      output: GetObjectAnnotationOutput;
    };
    sdk: {
      input: GetObjectAnnotationCommandInput;
      output: GetObjectAnnotationCommandOutput;
    };
  };
}
