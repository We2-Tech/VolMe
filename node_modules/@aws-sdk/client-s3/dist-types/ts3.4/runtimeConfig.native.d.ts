import { S3ClientConfig } from "./S3Client";
export declare const getRuntimeConfig: (config: S3ClientConfig) => {
  cacheMiddleware?: boolean;
  requestChecksumCalculation?:
    | import("@aws-sdk/checksums/flexible-checksums").RequestChecksumCalculation
    | import("@smithy/types").Provider<
        import("@aws-sdk/checksums/flexible-checksums").RequestChecksumCalculation
      >;
  responseChecksumValidation?:
    | import("@aws-sdk/checksums/flexible-checksums").ResponseChecksumValidation
    | import("@smithy/types").Provider<
        import("@aws-sdk/checksums/flexible-checksums").ResponseChecksumValidation
      >;
  requestStreamBufferSize?: number | false;
  checksumAlgorithms?: {
    CRC32?: import("@smithy/types").ChecksumConstructor;
    CRC32C?: import("@smithy/types").ChecksumConstructor;
    CRC64NVME?: import("@smithy/types").ChecksumConstructor;
    SHA1?: import("@smithy/types").ChecksumConstructor;
    SHA256?: import("@smithy/types").ChecksumConstructor;
  } & {
    [algorithmId: string]: import("@smithy/types").ChecksumConstructor;
  };
  forcePathStyle?:
    | (boolean & (boolean | import("@smithy/types").Provider<boolean | undefined>))
    | undefined;
  useAccelerateEndpoint?:
    | (boolean & (boolean | import("@smithy/types").Provider<boolean | undefined>))
    | undefined;
  disableMultiregionAccessPoints?:
    | (boolean & (boolean | import("@smithy/types").Provider<boolean | undefined>))
    | undefined;
  followRegionRedirects?: boolean;
  s3ExpressIdentityProvider?: import("@aws-sdk/middleware-sdk-s3/s3").S3ExpressIdentityProvider;
  bucketEndpoint?: boolean;
  expectContinueHeader?: boolean | number;
  endpoint?:
    | ((
        | string
        | import("@smithy/types").Endpoint
        | import("@smithy/types").EndpointV2
        | import("@smithy/types").Provider<import("@smithy/types").Endpoint>
        | import("@smithy/types").Provider<import("@smithy/types").EndpointV2>
      ) &
        (
          | string
          | import("@smithy/types").Endpoint
          | import("@smithy/types").EndpointV2
          | import("@smithy/types").Provider<string>
          | import("@smithy/types").Provider<import("@smithy/types").Endpoint>
          | import("@smithy/types").Provider<import("@smithy/types").EndpointV2>
        ))
    | undefined;
  tls?: boolean;
  ignoreConfiguredEndpointUrls?: boolean;
  serviceConfiguredEndpoint?: never;
  clientContextParams?: {
    disableS3ExpressSessionAuth?:
      | boolean
      | undefined
      | import("@smithy/types").Provider<boolean | undefined>;
  };
  useGlobalEndpoint?: boolean | undefined | import("@smithy/types").Provider<boolean | undefined>;
  disableS3ExpressSessionAuth?:
    | boolean
    | undefined
    | import("@smithy/types").Provider<boolean | undefined>;
  customUserAgent?: string | import("@smithy/types").UserAgent;
  userAgentAppId?: string | undefined | import("@smithy/types").Provider<string | undefined>;
  retryStrategy?: import("@smithy/types").RetryStrategy | import("@smithy/types").RetryStrategyV2;
  sigv4aSigningRegionSet?:
    | string[]
    | undefined
    | import("@smithy/types").Provider<string[] | undefined>;
  credentials?:
    | import("@smithy/types").AwsCredentialIdentity
    | import("@smithy/types").AwsCredentialIdentityProvider;
  signer?:
    | import("@smithy/types").RequestSigner
    | ((
        authScheme?: import("@smithy/types").AuthScheme,
      ) => Promise<import("@smithy/types").RequestSigner>);
  systemClockOffset?: number;
  signingRegion?: string;
  disableClockSkewCorrection?: boolean | import("@smithy/types").Provider<boolean>;
  authSchemePreference?: string[] | import("@smithy/types").Provider<string[]>;
  apiVersion: string;
  base64Decoder: import("@smithy/types").Decoder;
  base64Encoder: (_input: Uint8Array | string) => string;
  disableHostPrefix: boolean;
  endpointProvider: (
    params: import("./endpoint/EndpointParameters").EndpointParameters,
    context?: {
      logger?: import("@smithy/types").Logger;
    },
  ) => import("@smithy/types").EndpointV2;
  extensions: import("./runtimeExtensions").RuntimeExtension[];
  getAwsChunkedEncodingStream:
    | import("@smithy/types").GetAwsChunkedEncodingStream<any>
    | typeof import("@smithy/core/serde").getAwsChunkedEncodingStream;
  httpAuthSchemeProvider: import("./auth/httpAuthSchemeProvider").S3HttpAuthSchemeProvider;
  httpAuthSchemes: import("@smithy/types").HttpAuthScheme[];
  logger: import("@smithy/types").Logger;
  md5: import("@smithy/types").HashConstructor;
  protocol:
    | import("@smithy/types").$ClientProtocol<any, any>
    | import("@smithy/types").$ClientProtocolCtor<any, any>
    | typeof import("@aws-sdk/middleware-sdk-s3/s3").S3RestXmlProtocol;
  protocolSettings: {
    [setting: string]: unknown;
    defaultNamespace?: string;
  };
  sdkStreamMixin: import("@smithy/types").SdkStreamMixinInjector;
  serviceId: string;
  sha1: import("@smithy/types").HashConstructor;
  sha256: import("@smithy/types").HashConstructor;
  signerConstructor:
    | typeof import("@aws-sdk/signature-v4-multi-region").SignatureV4MultiRegion
    | (new (
        options: import("@smithy/signature-v4").SignatureV4Init &
          import("@smithy/signature-v4").SignatureV4CryptoInit,
      ) => import("@smithy/types").RequestSigner);
  signingEscapePath: boolean;
  urlParser: import("@smithy/types").UrlParser;
  useArnRegion: boolean | import("@smithy/types").Provider<boolean | undefined> | undefined;
  utf8Decoder: import("@smithy/types").Decoder;
  utf8Encoder: (input: Uint8Array | string) => string;
  profile?: string;
  defaultsMode:
    | import("@smithy/types").Provider<import("@smithy/core/client").DefaultsMode>
    | import("@smithy/core/client").DefaultsMode;
  bodyLengthChecker: import("@smithy/types").BodyLengthCalculator;
  credentialDefaultProvider:
    | ((input: any) => import("@smithy/types").AwsCredentialIdentityProvider)
    | ((_: unknown) => () => Promise<import("@smithy/types").AwsCredentialIdentity>);
  defaultUserAgentProvider: (
    config?: import("@aws-sdk/core/client").PreviouslyResolved,
  ) => Promise<import("@smithy/types").UserAgent>;
  eventStreamSerdeProvider: import("@smithy/types").EventStreamSerdeProvider;
  maxAttempts: number | import("@smithy/types").Provider<number>;
  region: string | import("@smithy/types").Provider<any>;
  requestHandler:
    | import("@smithy/fetch-http-handler").FetchHttpHandler
    | import("@smithy/types").FetchHttpHandlerOptions
    | import("@smithy/types").NodeHttpHandlerOptions
    | Record<string, unknown>
    | import("@smithy/core/protocols").HttpHandler<any>;
  retryMode: string | import("@smithy/types").Provider<string>;
  streamCollector: (
    stream: import("stream").Readable | import("stream/web").ReadableStream | ReadableStream | Blob,
  ) => Promise<Uint8Array>;
  streamHasher:
    | import("@smithy/types").StreamHasher<Blob>
    | import("@smithy/types").StreamHasher<import("stream").Readable>;
  useDualstackEndpoint: boolean | (() => Promise<boolean>);
  useFipsEndpoint: boolean | (() => Promise<boolean>);
  runtime: string;
};
