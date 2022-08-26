import { Container } from "@nextui-org/react";

export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => <Container fluid display="flex" justify="center" alignItems="center" css={{ h: "100vh" }}>
    {children}
</Container>

export default PageContainer;