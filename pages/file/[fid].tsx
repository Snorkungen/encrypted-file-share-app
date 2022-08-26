import React, { useEffect, useState } from "react";
import { Card, Container, Text, Loading, Link } from "@nextui-org/react";
import PageContainer from "../../components/PageContainer";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Head from "next/head";
import downloadFile from "../../lib/downloadFile";


const FilePage: NextPage = () => {
    const router = useRouter();
    const { fid } = router.query;

    let [isLoading, setIsLoading] = useState(true);
    let [file, setFile] = useState<File | undefined>(undefined);
    let [failed, setFailed] = useState(false);

    useEffect(() => {
        if (typeof fid !== "string") return;
        downloadFile(fid, location.hash.substring(1)).then(({ failed, file }) => {
            setIsLoading(false);
            if (failed) {
                setFailed(true);
            } else {
                setFile(file);
            }
        })

    }, [fid])


    return (
        <PageContainer>
            <Head>
                <title>EFSA Download</title>
            </Head>
            <Card css={{ mw: "440px" }}>
                <Card.Header>
                    <Text b h2>Download File</Text>
                </Card.Header>
                <Card.Body>
                    {isLoading ? <Loading type="points" /> :
                        !file ? <Text color="warning" >Loading of file failed.</Text> :
                            (<Container justify="center" alignContent="center" display="flex">
                                <Link
                                    color="secondary"
                                    as="a"
                                    download={file.name}
                                    href={URL.createObjectURL(file)}
                                >Download {file.name}</Link>
                            </Container>
                            )}
                </Card.Body>
            </Card>
        </PageContainer>
    )
}

export default FilePage;