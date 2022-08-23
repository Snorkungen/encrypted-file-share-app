import { META_DATA_SEPARATOR, concatenateArrayBuffers } from "../components/UploadFile";

type DownloadAPIResponse = {
    file_id: string;
    data: string;
    count: number;
    length: number;
}

type MetaData = {
    name: string;
    size: number;
    type?: string
}


export default class LoadFile {
    failed = false;
    id: string;
    rawKey: string;

    key?: CryptoKey;
    data?: ArrayBuffer;

    name?: MetaData["name"]
    size?: MetaData["size"]
    type?: MetaData["type"]

    constructor(id: string, rawKey: string) {
        this.id = id;
        this.rawKey = rawKey;

        this.load.bind(this);
    }

    base64ToBuffer(base64: string) {
        return Buffer.from(base64, "base64");
    }
    async loadKey(algorithm = { name: "AES-CTR", length: 256 }, extractable = true) {
        let keyBuffer = this.base64ToBuffer(this.rawKey);
        try {
            this.key = await window.crypto.subtle.importKey("raw", keyBuffer, algorithm, extractable, ["encrypt", "decrypt"]);
        } catch (error) {
            this.failed = true;
        }
        return this;
    }

    async decryptChunk(buf: Buffer): Promise<false | ArrayBuffer> {
        if (!this.key) return false;
        let counterLength = 16;
        let counter = buf.buffer.slice(0, counterLength);

        return await window.crypto.subtle.decrypt({
            name: "AES-CTR",
            counter,
            length: 64
        }, this.key, buf.buffer.slice(counterLength));
    }

    async load(count: number = 0): Promise<LoadFile> {
        let response = await fetch(`/api/download?id=${this.id}&count=${count}`);

        if (response.status != 200) {
            this.failed = true;
            return this;
        }
        let { data, } = await response.json() as DownloadAPIResponse;

        let buf = this.base64ToBuffer(data);
        let decryptedData = await this.decryptChunk(buf);
        if (!decryptedData) {
            this.failed = true;
            return this;
        }

        if (count === 0) {
            decryptedData = this.takeMetaData(decryptedData);
        }

        if (!this.data) {
            this.data = decryptedData
        } else {
            this.data = concatenateArrayBuffers(this.data, decryptedData);
        }

        if (!this.done) {
            return await this.load(count + 1)
        };
        return this;
    }

    takeMetaData(buf: ArrayBuffer): Buffer {
        let [md, data] = Buffer.from(buf).toString("binary").split(META_DATA_SEPARATOR);
        let { name, size, type } = JSON.parse(md) as MetaData;
        this.name = name;
        this.size = size;
        this.type = type;
        return Buffer.from(data, "binary");
    }

    get done() {
        if (
            this.failed ||
            !this.key ||
            !this.data ||
            !this.name ||
            !this.size ||
            (this.size > this.blob.size)
        ) return false;
        return true;
    }

    get blob() {
        if (!this.data) return new Blob();
        return new Blob([Buffer.from(this.data)], { type: this.type });
    }
    get file() {
        return new File([this.blob], this.name + "", { type: this.type });
    }
}

