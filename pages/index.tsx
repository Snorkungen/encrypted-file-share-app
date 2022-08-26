import type { NextPage } from 'next';
import { Card, Text } from '@nextui-org/react';
import Link from 'next/link';
import Head from 'next/head'
import PageContainer from '../components/PageContainer';

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>EFSA</title>
      </Head>
      <Card css={{ mw: "440px" }}>
        <Card.Header>
          <Text h2>Encrypted File Sharing App</Text>
        </Card.Header>
        <Card.Divider />
        <Card.Body>
          <Text>EFSA allows the user to upload files and later download files. This application works by encrypting and decrypting files on the client. And a version of the files are stored on a database.</Text>
        </Card.Body>
        <Card.Divider />
        <Card.Footer>
          <Link href="/upload">Upload file</Link>
        </Card.Footer>
      </Card>
    </PageContainer>
  )
}

export default Home;