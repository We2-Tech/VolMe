const T = new Uint32Array(256);
for (let i = 0; i < 256; ++i) {
    let c = i;
    for (let j = 0; j < 8; ++j) {
        c = c & 1 ? 0x82f63b78 ^ (c >>> 1) : c >>> 1;
    }
    T[i] = c >>> 0;
}
export class Crc32cJs {
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
