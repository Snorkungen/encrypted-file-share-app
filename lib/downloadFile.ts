import {
    META_DATA_SEPARATOR,
    COUNTER_LENGTH,
    KEY_PROPS_ALGORITHM,
    KEY_PROPS_EXTRACTABLE,
    KEY_PROPS_KEY_USAGES,
    useAlgorithm,
    MetaDataType,
    concatenateArrayBuffers
} from "./crypto";

type DownloadFileReturnType = { file: File, failed: false } | { file?: undefined, failed: true };

export default async function downLoadFile(id: string, keyStr: string): Promise<DownloadFileReturnType> {
    const loadChunk = async (count: number, key: CryptoKey): Promise<null | ArrayBuffer> => {
        // Load data
        let response = await fetch(`/api/download?id=${id}&count=${count}`);
        if (response.status !== 200) {
            return null;
        }

        let { data } = await response.json();
        if (!data) {
            return null;
        }

        // Decrypt data
        let { buffer } = Buffer.from(data, "base64");
        let counter = buffer.slice(0, COUNTER_LENGTH);
        return await window.crypto.subtle.decrypt(useAlgorithm(counter), key, buffer.slice(COUNTER_LENGTH));
    }

    try {
        let count = 0;
        // load key
        const key = await window.crypto.subtle.importKey(
            "raw",
            Buffer.from(keyStr, "base64"),
            KEY_PROPS_ALGORITHM,
            KEY_PROPS_EXTRACTABLE,
            KEY_PROPS_KEY_USAGES
        );

        let firstChunk = await loadChunk(count, key);
        if (!firstChunk) {
            return { failed: true };
        }

        let [md, data] = Buffer.from(firstChunk).toString("binary").split(META_DATA_SEPARATOR);
        let finalBuffer = Buffer.from(data, "binary").buffer;
        let { name, size, type } = JSON.parse(md) as MetaDataType;


        for (count = 1; finalBuffer.byteLength < size; count++) {
            let chunk = await loadChunk(count, key);
            if (!chunk) {
                return { failed: true }
            }

            finalBuffer = concatenateArrayBuffers(finalBuffer, chunk);
        }

        return {
            file: new File([new Blob([Buffer.from(finalBuffer)])], name, { type }),
            failed: false
        }
    } catch (error) {
        console.error(error);
        return { failed: true }
    }

}