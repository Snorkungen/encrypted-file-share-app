import { Button, Card, Input, Row, Text, Loading, Grid, Col, FormElement } from "@nextui-org/react";
import { NextPage } from "next";
import Head from "next/head";
import uploadFile from "../../lib/uploadFile";
import { useForm, SubmitHandler } from "react-hook-form";
import PageContainer from "../../components/PageContainer";
import Link from "next/link";
import React, { InputHTMLAttributes } from "react";

type FormValues = {
    files: FileList;
    failed: boolean;
    id: string;
    key: string;
}

const getFilePath = ({ id, key }: FormValues) => {
    return window.origin + "/file/" + id + "#" + key;
}

const UploadPage: NextPage = () => {
    const { register, handleSubmit, setValue, getValues, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async ({ files }) => {

        let { failed, id, key } = await uploadFile(files[0]);
        setValue("failed", failed);
        if (id && key) {
            setValue("id", id);
            setValue("key", key);
        }
    }

    const handleUrlInputClick = (event: React.MouseEvent<FormElement>) => {
        event.currentTarget.select()
    }

    return (
        <PageContainer>
            <Head>
                <title>EFSA Upload</title>
            </Head>
            <Card css={{ mw: "440px" }}>
                <Card.Header>
                    <Text b h2>Upload File</Text>
                </Card.Header>
                <Card.Divider />
                <Card.Body>
                    {isSubmitSuccessful ? (
                        getValues().failed ?
                            <Text>File Upload Failed</Text> :
                            (<>
                                <Row>
                                    <Text color="success" b>File Upload Succeded :</Text>
                                </Row>
                                <Row justify="center">
                                    <Input onClick={handleUrlInputClick} css={{ mt: "8px", width: "100%" }} readOnly bordered initialValue={getFilePath(getValues())} />
                                </Row>
                            </>)
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <Row align="center" justify="center">
                                <Input id="file-input" type="file" {...register("files", { required: true, })} />
                                <Button type="submit">Upload</Button>
                            </Row>
                        </form>
                    )}
                </Card.Body>
                <Card.Divider />
                <Card.Footer >
                    {errors.files && <Text color="error">File Required</Text>}
                    {isSubmitting && <Loading type="spinner" />}
                    {isSubmitSuccessful && <Text color="primary">Use the url above to download your file.</Text>}
                </Card.Footer>
            </Card>
        </PageContainer>
    )
};

export default UploadPage;