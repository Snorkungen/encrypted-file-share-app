import type { NextPage } from 'next';
import { Container, Card, Text } from '@nextui-org/react';
import UploadFile from '../components/UploadFile';
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>EFSA</title>
      </Head>
      <Container fluid display="flex" justify="center" alignItems="center" css={{ h: "100vh", background: "$background" }}>
        <UploadFile />
      </Container>
    </>
  )
}

export default Home;