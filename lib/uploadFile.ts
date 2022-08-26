import {
    META_DATA_SEPARATOR,
    concatenateArrayBuffers,
    KEY_PROPS_ALGORITHM,
    KEY_PROPS_EXTRACTABLE,
    KEY_PROPS_KEY_USAGES,
    algorithm
} from "./crypto";

type UploadFileReturnType = { id?: string, key?: string, failed: boolean };

const createMetaDataString = (file: File) => (JSON.stringify({
    name: file.name,
    size: file.size,
    type: file.type
}) + META_DATA_SEPARATOR);

export default async function uploadFile(file: File): Promise<UploadFileReturnType> {
    const metaDataString = createMetaDataString(file);
    const totalRawDataSize = (metaDataString.length + file.size);
    let response = await fetch("/api/upload");

    if (response.status !== 200) {
        return { failed: true }
    }

    const { id, chunkSize } = await response.json();
    try {
        const key = await window.crypto.subtle.generateKey(KEY_PROPS_ALGORITHM, KEY_PROPS_EXTRACTABLE, KEY_PROPS_KEY_USAGES);
        let exportedKey = await window.crypto.subtle.exportKey("raw", key);

        return new Promise(async (resolve) => {
            const reader = new FileReader();
            let count = 0, totalLoaded = 0;
            reader.readAsArrayBuffer(file.slice(0, chunkSize - metaDataString.length));

            reader.addEventListener("loadend", async ({ target }) => {
                if (!target) return resolve({ failed: true })
                let { result } = target;
                if (!result || typeof result == "string") return resolve({ failed: true })

                if (totalLoaded === 0) {
                    result = concatenateArrayBuffers(Buffer.from(metaDataString, "utf-8"), result);
                }

                let counter = window.crypto.getRandomValues(new Uint8Array(16))
                let encryptedData = await window.crypto.subtle.encrypt(algorithm(counter), key, result);

                response = await fetch("/api/upload", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: Buffer.from(concatenateArrayBuffers(counter, encryptedData)).toString("base64"),
                        id,
                        count,
                    })
                });

                if (response.status !== 204) {
                    return resolve({ failed: true })
                }

                totalLoaded += result.byteLength;
                if (totalLoaded >= totalRawDataSize) {
                    return resolve({
                        id,
                        key: Buffer.from(exportedKey).toString("base64"),
                        failed: false

                    })
                } else {
                    count += 1
                    target.readAsArrayBuffer(file.slice((
                        count === 1 ?
                            chunkSize * count - metaDataString.length :
                            chunkSize * count
                    ), chunkSize * (count + 1)))
                }
            })
        })
    } catch (error) {
        console.error(error);
        return { failed: true };
    }
}