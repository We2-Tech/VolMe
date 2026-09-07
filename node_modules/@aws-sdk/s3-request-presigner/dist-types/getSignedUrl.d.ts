import type { Client, Command } from "@smithy/core/client";
import type { MetadataBearer, RequestPresigningArguments } from "@smithy/types";
/**
 * @public
 */
export declare const getSignedUrl: <InputTypesUnion extends object, InputType extends InputTypesUnion, OutputType extends MetadataBearer = MetadataBearer>(client: Client<any, InputTypesUnion, MetadataBearer, any>, command: Command<InputType, OutputType, any, InputTypesUnion, MetadataBearer>, options?: RequestPresigningArguments) => Promise<string>;
