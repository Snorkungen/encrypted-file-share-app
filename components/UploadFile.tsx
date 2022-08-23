import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, Text, Input, Button } from "@nextui-org/react";
import { UploadResponse } from "../pages/api/upload";

type FormValues = {
    files: FileList;
}

export const META_DATA_SEPARATOR = "---------";

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

const finalSize = (num: number) => {

    return Math.floor(((num * 4) / 3) + (num / 96)) + 6;
}

const encrypt = async (key: CryptoKey, data: ArrayBuffer, counter: Uint8Array) => window.crypto.subtle.encrypt({
    name: "AES-CTR",
    counter,
    length: 64
}, key, data);


export const UploadFile = () => {
    const { register, handleSubmit } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async ({ files }) => {
        const file = files[0];
        try {
            let meta_data = JSON.stringify({
                name: file.name,
                type: file.type,
                size: file.size,
            }) + META_DATA_SEPARATOR;


            const get_response = await fetch("/api/upload?size=" + finalSize(file.size + meta_data.length));
            if (get_response.status !== 200) return;
            const { chunkSize, id } = await get_response.json() as UploadResponse;

            const key = await window.crypto.subtle.generateKey({
                name: "AES-CTR",
                length: 256
            }, true, ["encrypt", "decrypt"]);

            let exprtdKey = await window.crypto.subtle.exportKey("raw", key),
                exprtdKeyBase64 = Buffer.from(exprtdKey).toString("base64");

            let importedKey = await window.crypto.subtle.importKey("raw", Buffer.from(exprtdKeyBase64, "base64"), {
                name: "AES-CTR",
                length: 256
            }, true, ["encrypt", "decrypt"])

            let chunkCount = 0;

            const reader = new FileReader();

            let response;

            reader.readAsArrayBuffer(file.slice(0, chunkSize - meta_data.length))

            reader.onloadend = async () => {
                if (!reader.result) return;
                let result = reader.result as ArrayBuffer;

                let counter = window.crypto.getRandomValues(new Uint8Array(16))
                if (chunkCount == 0) {
                    result = concatenateArrayBuffers(
                        Buffer.from(meta_data, "utf8"),
                        result
                    );
                }

                if (result.byteLength < 1) return;

                let enc_chunk = await encrypt(key, result, counter),
                    data = Buffer.from(concatenateArrayBuffers(counter, enc_chunk)).toString("base64")

                response = await fetch("/api/upload", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data,
                        id,
                        count: chunkCount,
                    })
                });

                chunkCount++;
                if (chunkCount === 1) {
                    reader.readAsArrayBuffer(file.slice((chunkCount * chunkSize) - meta_data.length, chunkSize * (chunkCount + 1)))
                } else {
                    reader.readAsArrayBuffer(file.slice((chunkCount * chunkSize), chunkSize * (chunkCount + 1)))
                }
            }

            console.log("/file/" + id + "#" + exprtdKeyBase64)
        } catch (error) {
            console.log(error)
        }

    }

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <Card css={{ mw: "400px" }}>
                <Card.Header>
                    <Text h2>File Upload</Text>
                </Card.Header>
                <Card.Body>
                    <Input id="sdhj" type="file" label="File" {...register("files", { required: true })} />
                </Card.Body>
                <Card.Footer>
                    <Button type="submit">Upload</Button>
                </Card.Footer>
            </Card>
        </form>

    )
};
export default UploadFile;