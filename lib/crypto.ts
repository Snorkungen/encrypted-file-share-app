export const META_DATA_SEPARATOR = "---------";
export const COUNTER_LENGTH = 16;
export const KEY_PROPS_ALGORITHM = { name: "AES-CTR", length: 256 } as const;
export const KEY_PROPS_EXTRACTABLE = true as const;
export const KEY_PROPS_KEY_USAGES = ["encrypt", "decrypt"] as const;


export const useAlgorithm = (counter: ArrayBuffer) => {
    return {
        name: "AES-CTR",
        counter,
        length: 128
    }
}

export const concatenateArrayBuffers = (...arrayBuffers: Array<ArrayBuffer>) => {
    let size = arrayBuffers.reduce((sum, { byteLength }) => sum + byteLength, 0);
    let finalBuffer = new Uint8Array(size);
    let offset = 0;

    for (let arr of arrayBuffers) {
        finalBuffer.set(new Uint8Array(arr), offset);
        offset += arr.byteLength
    }

    return Buffer.from(finalBuffer).buffer;
}

export type MetaDataType = {
    name: string;
    type?: string;
    size: number
}