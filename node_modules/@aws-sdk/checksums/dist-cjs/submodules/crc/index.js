const { Crc32, Crc32Js, Crc32Node } = require("@smithy/core/checksum");
exports.Crc32 = Crc32;
exports.Crc32Js = Crc32Js;
exports.Crc32Node = Crc32Node;

const T = new Uint32Array(256);
for (let i = 0; i < 256; ++i) {
    let c = i;
    for (let j = 0; j < 8; ++j) {
        c = c & 1 ? 0x82f63b78 ^ (c >>> 1) : c >>> 1;
    }
    T[i] = c >>> 0;
}
class Crc32cJs {
    digestLength = 4;
    crc = 0xffff_ffff;
    update(data) {
        let crc = this.crc;
        for (let i = 0; i < data.length; ++i) {
            crc = (crc >>> 8) ^ T[(crc ^ data[i]) & 0xff];
        }
        this.crc = crc;
    }
    async digest() {
        const value = (this.crc ^ 0xffff_ffff) >>> 0;
        const out = new Uint8Array(4);
        out[0] = value >>> 24;
        out[1] = (value >>> 16) & 0xff;
        out[2] = (value >>> 8) & 0xff;
        out[3] = value & 0xff;
        return out;
    }
    reset() {
        this.crc = 0xffff_ffff;
    }
}

const Crc32cNode = Crc32cJs;

const crc64NvmeCrtContainer = {
    CrtCrc64Nvme: null,
};

const generateCRC64NVMETable = () => {
    const sliceLength = 8;
    const tables = new Array(sliceLength);
    for (let slice = 0; slice < sliceLength; slice++) {
        const table = new Array(512);
        for (let i = 0; i < 256; i++) {
            let crc = BigInt(i);
            for (let j = 0; j < 8 * (slice + 1); j++) {
                if (crc & 1n) {
                    crc = (crc >> 1n) ^ 0x9a6c9329ac4bc9b5n;
                }
                else {
                    crc = crc >> 1n;
                }
            }
            table[i * 2] = Number((crc >> 32n) & 0xffffffffn);
            table[i * 2 + 1] = Number(crc & 0xffffffffn);
        }
        tables[slice] = new Uint32Array(table);
    }
    return tables;
};
let CRC64_NVME_REVERSED_TABLE;
let t0, t1, t2, t3;
let t4, t5, t6, t7;
const ensureTablesInitialized = () => {
    if (!CRC64_NVME_REVERSED_TABLE) {
        CRC64_NVME_REVERSED_TABLE = generateCRC64NVMETable();
        [t0, t1, t2, t3, t4, t5, t6, t7] = CRC64_NVME_REVERSED_TABLE;
    }
};
class Crc64NvmeJs {
    c1 = 0;
    c2 = 0;
    constructor() {
        ensureTablesInitialized();
        this.reset();
    }
    update(data) {
        const len = data.length;
        let i = 0;
        let crc1 = this.c1;
        let crc2 = this.c2;
        while (i + 8 <= len) {
            const idx0 = ((crc2 ^ data[i++]) & 255) << 1;
            const idx1 = (((crc2 >>> 8) ^ data[i++]) & 255) << 1;
            const idx2 = (((crc2 >>> 16) ^ data[i++]) & 255) << 1;
            const idx3 = (((crc2 >>> 24) ^ data[i++]) & 255) << 1;
            const idx4 = ((crc1 ^ data[i++]) & 255) << 1;
            const idx5 = (((crc1 >>> 8) ^ data[i++]) & 255) << 1;
            const idx6 = (((crc1 >>> 16) ^ data[i++]) & 255) << 1;
            const idx7 = (((crc1 >>> 24) ^ data[i++]) & 255) << 1;
            crc1 = t7[idx0] ^ t6[idx1] ^ t5[idx2] ^ t4[idx3] ^ t3[idx4] ^ t2[idx5] ^ t1[idx6] ^ t0[idx7];
            crc2 =
                t7[idx0 + 1] ^
                    t6[idx1 + 1] ^
                    t5[idx2 + 1] ^
                    t4[idx3 + 1] ^
                    t3[idx4 + 1] ^
                    t2[idx5 + 1] ^
                    t1[idx6 + 1] ^
                    t0[idx7 + 1];
        }
        while (i < len) {
            const idx = ((crc2 ^ data[i]) & 255) << 1;
            crc2 = ((crc2 >>> 8) | ((crc1 & 255) << 24)) >>> 0;
            crc1 = (crc1 >>> 8) ^ t0[idx];
            crc2 ^= t0[idx + 1];
            ++i;
        }
        this.c1 = crc1;
        this.c2 = crc2;
    }
    async digest() {
        const c1 = this.c1 ^ 4294967295;
        const c2 = this.c2 ^ 4294967295;
        return new Uint8Array([
            c1 >>> 24,
            (c1 >>> 16) & 255,
            (c1 >>> 8) & 255,
            c1 & 255,
            c2 >>> 24,
            (c2 >>> 16) & 255,
            (c2 >>> 8) & 255,
            c2 & 255,
        ]);
    }
    reset() {
        this.c1 = 4294967295;
        this.c2 = 4294967295;
    }
}

class Crc64Nvme {
    impl;
    constructor() {
        const Crt = crc64NvmeCrtContainer.CrtCrc64Nvme;
        this.impl = Crt ? new Crt() : new Crc64NvmeJs();
    }
    update(data) {
        this.impl.update(data);
    }
    async digest() {
        return this.impl.digest();
    }
    reset() {
        this.impl.reset();
    }
}

exports.Crc32c = Crc32cNode;
exports.Crc32cJs = Crc32cJs;
exports.Crc32cNode = Crc32cNode;
exports.Crc64Nvme = Crc64Nvme;
exports.Crc64NvmeJs = Crc64NvmeJs;
exports.crc64NvmeCrtContainer = crc64NvmeCrtContainer;
