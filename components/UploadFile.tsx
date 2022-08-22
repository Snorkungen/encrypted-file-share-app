import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, Text, Input, Button } from "@nextui-org/react";
import { read } from "fs";

type FormValues = {
    files: FileList;
}

export const UploadFile = () => {
    const { register, handleSubmit } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async ({ files }) => {

        try {
            const CHUNK_SIZE = 100 * 1000 * 8;
            let counter = window.crypto.getRandomValues(new Uint8Array(16));;
            const key = await window.crypto.subtle.generateKey({
                name: "AES-CTR",
                length: 256
            }, true, ["encrypt", "decrypt"]);

            for (let file of Array.from(files)) {
                const reader = new FileReader();
                let chunkSize = 0;



                let firstChunk = Buffer.from(
                    JSON.stringify({
                        filename: file.name,
                        type: file.type,
                        chunkSize: CHUNK_SIZE,
                        chunkCount: Math.ceil(file.size / CHUNK_SIZE)
                    })
                ).toString("base64");

                let exprtdKey = await window.crypto.subtle.exportKey("raw", key),
                    exprtdKeyBase64 = Buffer.from(exprtdKey).toString("base64");

                console.log(firstChunk,exprtdKeyBase64)

                reader.readAsArrayBuffer(file.slice(chunkSize, CHUNK_SIZE + chunkSize))

                reader.onloadend = async () => {
                    if (!reader.result) return;
                    counter = window.crypto.getRandomValues(new Uint8Array(16));

                    let enc_chunk = await window.crypto.subtle.encrypt({
                        name: "AES-CTR",
                        counter,
                        length: 64
                    }, key, reader.result as ArrayBuffer),
                        enc_buf = Buffer.from(enc_chunk).toString("base64")

                    let dec_buf = Buffer.from(enc_buf, "base64"),
                        dec_chunk = await window.crypto.subtle.decrypt({
                            name: "AES-CTR",
                            counter,
                            length: 64
                        }, key, dec_buf);



                    console.log(
                        Buffer.from(dec_chunk).toString("utf-8")
                    )

                    console.log(
                        new File([dec_chunk], file.name),
                        file
                    )


                    chunkSize += CHUNK_SIZE;
                    if (chunkSize > file.size) return;
                    reader.readAsArrayBuffer(file.slice(chunkSize, CHUNK_SIZE + chunkSize))
                }


                
            }


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