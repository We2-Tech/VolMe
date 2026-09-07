import { crc64NvmeCrtContainer } from "./crc64-nvme-crt-container";
import { Crc64NvmeJs } from "./Crc64NvmeJs";
export class Crc64Nvme {
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
