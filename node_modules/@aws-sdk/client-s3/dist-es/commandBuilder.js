import { getFlexibleChecksumsPlugin } from "@aws-sdk/checksums/flexible-checksums";
import { getCheckContentLengthHeaderPlugin, getLocationConstraintPlugin, getS3ExpiresMiddlewarePlugin, getSsecPlugin, getThrow200ExceptionsPlugin, } from "@aws-sdk/middleware-sdk-s3/s3";
import { makeBuilder } from "@smithy/core/client";
import { getEndpointPlugin } from "@smithy/core/endpoints";
import { commonParams } from "./endpoint/EndpointParameters";
export const command = makeBuilder(commonParams, "AmazonS3", "S3Client", getEndpointPlugin);
export const _ep0 = {
    Bucket: { type: "contextParams", name: "Bucket" },
    Key: { type: "contextParams", name: "Key" },
};
export const _ep1 = {
    DisableS3ExpressSessionAuth: { type: "staticContextParams", value: true },
    Bucket: { type: "contextParams", name: "Bucket" },
    Key: { type: "contextParams", name: "Key" },
    CopySource: { type: "contextParams", name: "CopySource" },
};
export const _ep2 = {
    UseS3ExpressControlEndpoint: { type: "staticContextParams", value: true },
    DisableAccessPoints: { type: "staticContextParams", value: true },
    Bucket: { type: "contextParams", name: "Bucket" },
};
export const _ep3 = {
    UseS3ExpressControlEndpoint: { type: "staticContextParams", value: true },
    Bucket: { type: "contextParams", name: "Bucket" },
};
export const _ep4 = {
    DisableS3ExpressSessionAuth: { type: "staticContextParams", value: true },
    Bucket: { type: "contextParams", name: "Bucket" },
};
export const _ep5 = {
    Bucket: { type: "contextParams", name: "Bucket" },
};
export const _ep6 = {};
export const _ep7 = {
    UseS3ExpressControlEndpoint: { type: "staticContextParams", value: true },
};
export const _ep8 = {
    Bucket: { type: "contextParams", name: "Bucket" },
    Prefix: { type: "contextParams", name: "Prefix" },
};
export const _ep9 = {
    UseObjectLambdaEndpoint: { type: "staticContextParams", value: true },
};
export const _mw0 = (Command, cs, config, o) => [
    getThrow200ExceptionsPlugin(config),
];
export const _mw1 = (Command, cs, config, o) => [
    getThrow200ExceptionsPlugin(config),
    getSsecPlugin(config),
];
export const _mw2 = (Command, cs, config, o) => [
    getThrow200ExceptionsPlugin(config),
    getLocationConstraintPlugin(config),
];
export const _mw3 = (Command, cs, config, o) => [
    getFlexibleChecksumsPlugin(config, {
        requestAlgorithmMember: { "httpHeader": "x-amz-sdk-checksum-algorithm", "name": "ChecksumAlgorithm", },
        requestChecksumRequired: true,
    }),
];
export const _mw4 = (Command, cs, config, o) => [];
export const _mw5 = (Command, cs, config, o) => [
    getFlexibleChecksumsPlugin(config, {
        requestAlgorithmMember: { "httpHeader": "x-amz-sdk-checksum-algorithm", "name": "ChecksumAlgorithm", },
        requestChecksumRequired: true,
    }),
    getThrow200ExceptionsPlugin(config),
];
export const _mw6 = (Command, cs, config, o) => [
    getFlexibleChecksumsPlugin(config, {
        requestChecksumRequired: false,
        requestValidationModeMember: "ChecksumMode",
        responseAlgorithms: ["CRC64NVME", "CRC32", "CRC32C", "SHA256", "SHA1", "SHA512", "MD5", "XXHASH64", "XXHASH3", "XXHASH128"],
    }),
];
export const _mw7 = (Command, cs, config, o) => [
    getFlexibleChecksumsPlugin(config, {
        requestChecksumRequired: false,
        requestValidationModeMember: "ChecksumMode",
        responseAlgorithms: ["CRC64NVME", "CRC32", "CRC32C", "SHA256", "SHA1", "SHA512", "MD5", "XXHASH64", "XXHASH3", "XXHASH128"],
    }),
    getSsecPlugin(config),
    getS3ExpiresMiddlewarePlugin(config),
];
export const _mw8 = (Command, cs, config, o) => [
    getThrow200ExceptionsPlugin(config),
    getSsecPlugin(config),
    getS3ExpiresMiddlewarePlugin(config),
];
export const _mw9 = (Command, cs, config, o) => [
    getFlexibleChecksumsPlugin(config, {
        requestAlgorithmMember: { "httpHeader": "x-amz-sdk-checksum-algorithm", "name": "ChecksumAlgorithm", },
        requestChecksumRequired: false,
    }),
];
export const _mw10 = (Command, cs, config, o) => [
    getFlexibleChecksumsPlugin(config, {
        requestAlgorithmMember: { "httpHeader": "x-amz-sdk-checksum-algorithm", "name": "ChecksumAlgorithm", },
        requestChecksumRequired: false,
    }),
    getThrow200ExceptionsPlugin(config),
];
export const _mw11 = (Command, cs, config, o) => [
    getFlexibleChecksumsPlugin(config, {
        requestAlgorithmMember: { "httpHeader": "x-amz-sdk-checksum-algorithm", "name": "ChecksumAlgorithm", },
        requestChecksumRequired: false,
    }),
    getCheckContentLengthHeaderPlugin(config),
    getThrow200ExceptionsPlugin(config),
    getSsecPlugin(config),
];
export const _mw12 = (Command, cs, config, o) => [
    getSsecPlugin(config),
];
export const _mw13 = (Command, cs, config, o) => [
    getFlexibleChecksumsPlugin(config, {
        requestAlgorithmMember: { "httpHeader": "x-amz-sdk-checksum-algorithm", "name": "ChecksumAlgorithm", },
        requestChecksumRequired: false,
    }),
    getThrow200ExceptionsPlugin(config),
    getSsecPlugin(config),
];
