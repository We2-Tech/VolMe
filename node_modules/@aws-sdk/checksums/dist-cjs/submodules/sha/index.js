const { toUint8Array, concatBytes } = require("@smithy/core/serde");
const { createHmac, createHash } = require("node:crypto");
const { Sha256, Sha256Js, Sha256Node } = require("@smithy/core/checksum");
exports.Sha256 = Sha256;
exports.Sha256Js = Sha256Js;
exports.Sha256Node = Sha256Node;

const BLOCK = 64;
const DIGEST_LENGTH = 20;
const INIT = new Int32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
const K = new Int32Array([0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6]);
class Sha1Js {
    digestLength = DIGEST_LENGTH;
    state = Int32Array.from(INIT);
    w;
    buffer = new Uint8Array(BLOCK);
    bufferLength = 0;
    bytesHashed = 0;
    finished = false;
    inner;
    outer;
    constructor(secret) {
        if (secret) {
            const key = Sha1Js.normalizeKey(secret);
            this.inner = new Sha1Js();
            this.outer = new Sha1Js();
            const pad = new Uint8Array(BLOCK * 2);
            for (let i = 0; i < BLOCK; ++i) {
                pad[i] = 0x36 ^ key[i];
                pad[i + BLOCK] = 0x5c ^ key[i];
            }
            this.inner.update(pad.subarray(0, BLOCK));
            this.outer.update(pad.subarray(BLOCK));
        }
    }
    update(data) {
        if (this.finished) {
            throw new Error("Attempted to update an already finished HMAC.");
        }
        if (this.inner) {
            this.inner.update(data);
            return;
        }
        let pos = 0;
        let { length } = data;
        this.bytesHashed += length;
        if (this.bufferLength > 0) {
            while (length > 0 && this.bufferLength < BLOCK) {
                this.buffer[this.bufferLength++] = data[pos++];
                --length;
            }
            if (this.bufferLength === BLOCK) {
                this.hashBuffer(this.buffer, 0);
                this.bufferLength = 0;
            }
        }
        while (length >= BLOCK) {
            this.hashBuffer(data, pos);
            pos += BLOCK;
            length -= BLOCK;
        }
        while (length > 0) {
            this.buffer[this.bufferLength++] = data[pos++];
            --length;
        }
    }
    async digest() {
        if (this.inner && this.outer) {
            if (this.finished) {
                throw new Error("Attempted to digest an already finished HMAC.");
            }
            this.finished = true;
            const innerDigest = this.inner.digestSync();
            this.outer.update(innerDigest);
            return this.outer.digestSync();
        }
        return this.digestSync();
    }
    reset() {
        this.state = Int32Array.from(INIT);
        this.buffer = new Uint8Array(BLOCK);
        this.bufferLength = 0;
        this.bytesHashed = 0;
    }
    digestSync() {
        const state = this.state.slice();
        const buffer = this.buffer.slice();
        let bufferLength = this.bufferLength;
        const bitsHi = (this.bytesHashed / 0x20000000) | 0;
        const bitsLo = this.bytesHashed << 3;
        buffer[bufferLength++] = 0x80;
        if (bufferLength > BLOCK - 8) {
            for (let i = bufferLength; i < BLOCK; ++i) {
                buffer[i] = 0;
            }
            this.hashBufferWith(state, buffer, 0);
            bufferLength = 0;
        }
        for (let i = bufferLength; i < BLOCK - 8; ++i) {
            buffer[i] = 0;
        }
        const v = new DataView(buffer.buffer, buffer.byteOffset, BLOCK);
        v.setUint32(BLOCK - 8, bitsHi, false);
        v.setUint32(BLOCK - 4, bitsLo, false);
        this.hashBufferWith(state, buffer, 0);
        const out = new Uint8Array(DIGEST_LENGTH);
        out[0] = (state[0] >>> 24) & 0xff;
        out[1] = (state[0] >>> 16) & 0xff;
        out[2] = (state[0] >>> 8) & 0xff;
        out[3] = state[0] & 0xff;
        out[4] = (state[1] >>> 24) & 0xff;
        out[5] = (state[1] >>> 16) & 0xff;
        out[6] = (state[1] >>> 8) & 0xff;
        out[7] = state[1] & 0xff;
        out[8] = (state[2] >>> 24) & 0xff;
        out[9] = (state[2] >>> 16) & 0xff;
        out[10] = (state[2] >>> 8) & 0xff;
        out[11] = state[2] & 0xff;
        out[12] = (state[3] >>> 24) & 0xff;
        out[13] = (state[3] >>> 16) & 0xff;
        out[14] = (state[3] >>> 8) & 0xff;
        out[15] = state[3] & 0xff;
        out[16] = (state[4] >>> 24) & 0xff;
        out[17] = (state[4] >>> 16) & 0xff;
        out[18] = (state[4] >>> 8) & 0xff;
        out[19] = state[4] & 0xff;
        return out;
    }
    static normalizeKey(secret) {
        const key = toUint8Array(secret);
        if (key.byteLength > BLOCK) {
            const h = new Sha1Js();
            h.update(key);
            const digest = h.digestSync();
            const padded = new Uint8Array(BLOCK);
            padded.set(digest);
            return padded;
        }
        const padded = new Uint8Array(BLOCK);
        padded.set(key);
        return padded;
    }
    hashBuffer(data, offset) {
        this.hashBufferWith(this.state, data, offset);
    }
    hashBufferWith(state, data, offset) {
        const w = (this.w ??= new Int32Array(80));
        let s0 = state[0], s1 = state[1], s2 = state[2], s3 = state[3], s4 = state[4];
        for (let t = 0; t < 16; ++t) {
            w[t] =
                ((data[offset + t * 4] & 0xff) << 24) |
                    ((data[offset + t * 4 + 1] & 0xff) << 16) |
                    ((data[offset + t * 4 + 2] & 0xff) << 8) |
                    (data[offset + t * 4 + 3] & 0xff);
        }
        for (let t = 16; t < 80; ++t) {
            const x = w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16];
            w[t] = (x << 1) | (x >>> 31);
        }
        for (let t = 0; t < 80; ++t) {
            const r = t < 20 ? 0 : t < 40 ? 1 : t < 60 ? 2 : 3;
            const temp = (((((s0 << 5) | (s0 >>> 27)) +
                (r === 0 ? (s1 & s2) ^ (~s1 & s3) : r === 2 ? (s1 & s2) ^ (s1 & s3) ^ (s2 & s3) : s1 ^ s2 ^ s3)) |
                0) +
                ((s4 + ((K[r] + w[t]) | 0)) | 0)) |
                0;
            s4 = s3;
            s3 = s2;
            s2 = (s1 << 30) | (s1 >>> 2);
            s1 = s0;
            s0 = temp;
        }
        state[0] = (state[0] + s0) | 0;
        state[1] = (state[1] + s1) | 0;
        state[2] = (state[2] + s2) | 0;
        state[3] = (state[3] + s3) | 0;
        state[4] = (state[4] + s4) | 0;
    }
}

const hasNativeCrypto = (() => {
    try {
        createHash("sha1");
        return true;
    }
    catch {
        return false;
    }
})();
const Sha1Node = hasNativeCrypto ? buildNativeClass() : Sha1Js;
function buildNativeClass() {
    return class Sha1Node {
        digestLength = 20;
        secret;
        hash;
        isHmac;
        finished = false;
        constructor(secret) {
            this.secret = secret;
            this.isHmac = !!secret;
            this.hash = this.createHash();
        }
        update(data) {
            if (this.finished) {
                throw new Error("Attempted to update an already finished hash.");
            }
            this.hash.update(data);
        }
        async digest() {
            let buf;
            if (this.isHmac) {
                this.finished = true;
                buf = this.hash.digest();
            }
            else {
                buf = this.hash.copy().digest();
            }
            return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
        }
        reset() {
            this.hash = this.createHash();
            this.finished = false;
        }
        createHash() {
            return this.secret ? createHmac("sha1", toBuffer(this.secret)) : createHash("sha1");
        }
    };
}
function toBuffer(data) {
    if (typeof data === "string") {
        return data;
    }
    if (ArrayBuffer.isView(data)) {
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    }
    return Buffer.from(data);
}

const { digest, sign, importKey } = globalThis?.crypto?.subtle ?? {};
const subtle = typeof digest === "function" && typeof sign === "function" && typeof importKey === "function"
    ? globalThis.crypto.subtle
    : undefined;
const MAX_PENDING_BYTES = 8 * 1024 * 1024;
class Sha1WebCrypto {
    digestLength = 20;
    secret;
    pending = [];
    pendingBytes = 0;
    fallback;
    finished = false;
    constructor(secret) {
        if (secret) {
            this.secret = toUint8Array(secret);
        }
    }
    update(data) {
        if (this.finished) {
            throw new Error("Attempted to update an already finished HMAC.");
        }
        if (this.fallback) {
            this.fallback.update(data);
            return;
        }
        this.pending.push(data.slice());
        this.pendingBytes += data.byteLength;
        if (this.pendingBytes >= MAX_PENDING_BYTES) {
            this.switchToFallback();
        }
    }
    async digest() {
        if (this.fallback) {
            return this.fallback.digest();
        }
        if (this.secret && this.finished) {
            throw new Error("Attempted to digest an already finished HMAC.");
        }
        const data = concatBytes(this.pending);
        if (subtle) {
            if (this.secret) {
                this.finished = true;
                const key = await subtle.importKey("raw", this.secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
                const sig = await subtle.sign("HMAC", key, data);
                return new Uint8Array(sig);
            }
            const hash = await subtle.digest("SHA-1", data);
            return new Uint8Array(hash);
        }
        const sha1 = new Sha1Js(this.secret);
        sha1.update(data);
        return sha1.digest();
    }
    reset() {
        this.pending = [];
        this.pendingBytes = 0;
        this.fallback = undefined;
        this.finished = false;
    }
    switchToFallback() {
        const sha1Js = new Sha1Js(this.secret);
        for (const chunk of this.pending) {
            sha1Js.update(chunk);
        }
        this.fallback = sha1Js;
        this.pending = [];
        this.pendingBytes = 0;
    }
}

exports.Sha1 = Sha1Node;
exports.Sha1Js = Sha1Js;
exports.Sha1Node = Sha1Node;
exports.Sha1WebCrypto = Sha1WebCrypto;
