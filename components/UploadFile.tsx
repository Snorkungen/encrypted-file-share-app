import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, Text, Input, Button } from "@nextui-org/react";
import { UploadResponse } from "../pages/api/upload";

type FormValues = {
    files: FileList;
}

export const UploadFile = () => {
    const { register, handleSubmit } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async ({ files }) => {
        const file = files[0];
        try {
            const get_response = await fetch("/api/upload?size=" + file.size);
            const { chunkSize, id } = await get_response.json() as UploadResponse;
            let counter = window.crypto.getRandomValues(new Uint8Array(16));
            const key = await window.crypto.subtle.generateKey({
                name: "AES-CTR",
                length: 256
            }, true, ["encrypt", "decrypt"]);

            let chunkCount = 0;

            const reader = new FileReader();

            let firstChunk = Buffer.from(
                JSON.stringify({
                    filename: file.name,
                    type: file.type,
                    chunkSize,
                    chunkAmount: Math.ceil(file.size / chunkSize)
                })
            );


            counter = window.crypto.getRandomValues(new Uint8Array(16));
            let enc_firstChunk = await window.crypto.subtle.encrypt({
                name: "AES-CTR",
                counter,
                length: 64
            }, key, firstChunk);

            let response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: Buffer.from(enc_firstChunk).toString("base64"),
                    id,
                    count: chunkCount,
                })
            })

            reader.readAsArrayBuffer(file.slice(chunkCount * chunkSize, chunkSize * (chunkCount + 1)))

            reader.onloadend = async () => {
                if (!reader.result) return;
                chunkCount++;
                counter = window.crypto.getRandomValues(new Uint8Array(16));

                let enc_chunk = await window.crypto.subtle.encrypt({
                    name: "AES-CTR",
                    counter,
                    length: 64
                }, key, reader.result as ArrayBuffer),
                    data = Buffer.from(enc_chunk).toString("base64")

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
                })


                if (chunkCount * chunkSize > file.size) return;
                reader.readAsArrayBuffer(file.slice(chunkCount * chunkSize, chunkSize * (chunkCount + 1)))
            }

            let exprtdKey = await window.crypto.subtle.exportKey("raw", key),
                exprtdKeyBase64 = Buffer.from(exprtdKey).toString("base64");

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
                    <Input type="file" label="File" {...register("files", { required: true })} />
                </Card.Body>
                <Card.Footer>
                    <Button type="submit">Upload</Button>
                </Card.Footer>
            </Card>
        </form>

    )
};
export default UploadFile;