import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, Text, Input, Button } from "@nextui-org/react";

type FormValues = {
    file: FileList;
}

export const UploadFile = () => {
    const { register, handleSubmit } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <Card css={{ mw: "400px" }}>
                <Card.Header>
                    <Text h2>File Upload</Text>
                </Card.Header>
                <Card.Body>
                    <Input type="file" label="File" {...register("file", { required: true })} />
                </Card.Body>
                <Card.Footer>
                    <Button type="submit">Upload</Button>
                </Card.Footer>
            </Card>
        </form>

    )
};
export default UploadFile;