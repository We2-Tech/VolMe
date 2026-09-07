import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteBucketWebsiteRequest } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteBucketWebsiteCommandInput extends DeleteBucketWebsiteRequest {}
export interface DeleteBucketWebsiteCommandOutput extends __MetadataBearer {}
declare const DeleteBucketWebsiteCommand_base: {
  new (
    input: DeleteBucketWebsiteCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketWebsiteCommandInput,
    DeleteBucketWebsiteCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteBucketWebsiteCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteBucketWebsiteCommandInput,
    DeleteBucketWebsiteCommandOutput,
    import("..").S3ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteBucketWebsiteCommand extends DeleteBucketWebsiteCommand_base {
  protected static __types: {
    api: {
      input: DeleteBucketWebsiteRequest;
      output: {};
    };
    sdk: {
      input: DeleteBucketWebsiteCommandInput;
      output: DeleteBucketWebsiteCommandOutput;
    };
  };
}
