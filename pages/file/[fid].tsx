import { Container, css } from "@nextui-org/react";
import { NextPage } from "next";
import Head from 'next/head'
import { useRouter } from "next/router";
import { META_DATA_SEPARATOR } from "../../components/UploadFile";
import { useEffect, useState } from "react";
const getKey = async () => {
    if (!location) return null;
    if (!location.hash) return null;
    let base64key = location.hash.substring(1),
        keyBuffer = Buffer.from(base64key, "base64"),
        key = await window.crypto.subtle.importKey("raw", keyBuffer, {
            name: "AES-CTR",
            length: 256
        }, true, ["encrypt", "decrypt"])

    return key;
}

const FilePage: NextPage = () => {
    const router = useRouter();
    const { fid } = router.query;
    const [metaData, setMetaData] = useState<Record<string, any>>({});
    const [file, setFile] = useState<ArrayBuffer | null>(null);
    const [image, setImage] = useState("");
    let count = 0;

    useEffect(() => {
        fetch(`/api/download?id=${fid}&count=${count}`)
            .then(async (res) => {
                if (res.status != 200) return;
                try {
                    let { data } = await res.json();
                    let key = await getKey();
                    let enc_data = Buffer.from(data, "base64");

                    if (!key) return;
                    let counter = enc_data.buffer.slice(0, 16);


                    let dec_data = await window.crypto.subtle.decrypt({
                        name: "AES-CTR",
                        counter,
                        length: 64
                    }, key, enc_data.buffer.slice(16));

                    let [metaDataString, dataString] = Buffer.from(dec_data).toString("binary").split(META_DATA_SEPARATOR);
                    let meta_data = JSON.parse(metaDataString)
                    setMetaData(meta_data);
                    setFile(Buffer.from(dataString,"binary"))

                } catch (error) {
                    console.log(error)
                }

            })

    }, [fid])

    useEffect(() => {
        if (!metaData || !file) return;
        let blob = new Blob([Buffer.from(file)])
        console.log(file.byteLength,metaData.size)
        

            if(metaData.type.includes("image")) setImage(URL.createObjectURL(blob));

    }, [file, metaData])

    return (
        <>
            <Head>
                <title>EFSA </title>
            </Head>
            <Container fluid display="flex" justify="center" alignItems="center" css={{ h: "100vh", background: "$background" }}>
                <div>
                    {image && <img src={image} />}
                </div>
            </Container>
        </>
    )
}

export default FilePage;