import { Container, css } from "@nextui-org/react";
import { NextPage } from "next";
import Head from 'next/head'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadFile from "../../lib/LoadFile";



const FilePage: NextPage = () => {
    const router = useRouter();
    const { fid } = router.query;
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState("");

    useEffect(() => {
        if (typeof fid !== "string") return;
        new LoadFile(fid, location.hash.substring(1)).loadKey().then(async (ld) => {
            await ld.load();
            // if (!ld.done) return;
            console.log(URL.createObjectURL(ld.blob))
            setFile(ld.file);
        });



    }, [fid])

    useEffect(() => {
        if (!file) return;

        console.log(file)

        if (file.type.includes("image")) setImage(URL.createObjectURL(file));

    }, [file])

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