import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateBucketOutput, CreateBucketRequest } from "../models/models_0";
export { __MetadataBearer };
export interface CreateBucketCommandInput extends CreateBucketRequest {}
export interface CreateBucketCommandOutput extends CreateBucketOutput, __MetadataBearer {}
declare const CreateBucketCommand_base: {
  new (
    input: CreateBucketCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateBucketCommandInput,
    CreateBucketCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateBucketCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateBucketCommandInput,
    CreateBucketCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateBucketCommand extends CreateBucketCommand_base {
  protected static __types: {
    api: {
      input: CreateBucketRequest;
      output: CreateBucketOutput;
    };
    sdk: {
      input: CreateBucketCommandInput;
      output: CreateBucketCommandOutput;
    };
  };
}
