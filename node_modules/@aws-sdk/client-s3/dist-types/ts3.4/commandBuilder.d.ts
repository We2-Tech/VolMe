import { EndpointParameterInstructions } from "@smithy/types";
import { S3ClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "./S3Client";
export declare const command: <I extends ServiceInputTypes, O extends ServiceOutputTypes>(
  added: EndpointParameterInstructions,
  plugins: (
    CommandCtor: any,
    clientStack: any,
    config: any,
    options: any,
  ) => import("@smithy/types").Pluggable<any, any>[],
  op: string,
  $: import("@smithy/types").StaticOperationSchema,
  smithyContext?: Record<string, unknown>,
) => {
  new (
    input: I,
  ): import("@smithy/core/client").CommandImpl<
    I,
    O,
    S3ClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: import("@smithy/types").OptionalParameter<I>
  ): import("@smithy/core/client").CommandImpl<
    I,
    O,
    S3ClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): EndpointParameterInstructions;
};
export declare const _ep0: EndpointParameterInstructions;
export declare const _ep1: EndpointParameterInstructions;
export declare const _ep2: EndpointParameterInstructions;
export declare const _ep3: EndpointParameterInstructions;
export declare const _ep4: EndpointParameterInstructions;
export declare const _ep5: EndpointParameterInstructions;
export declare const _ep6: EndpointParameterInstructions;
export declare const _ep7: EndpointParameterInstructions;
export declare const _ep8: EndpointParameterInstructions;
export declare const _ep9: EndpointParameterInstructions;
export declare const _mw0: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw1: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw2: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw3: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw4: (Command: any, cs: any, config: any, o: any) => never[];
export declare const _mw5: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw6: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw7: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw8: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw9: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw10: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw11: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw12: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
export declare const _mw13: (
  Command: any,
  cs: any,
  config: any,
  o: any,
) => import("@smithy/types").Pluggable<any, any>[];
