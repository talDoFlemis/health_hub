import Head from "next/head";
import {
    TableContainer,
    Table, Thead, TableCaption,
} from "@chakra-ui/react";

const consult = () => {
    return (<>
        <Head>
            <title>Marque sua consulta</title>
        </Head>
        <main>
            <div className="flex flex-column items-center justify-center">
                <TableContainer className={`
                    bg-
                `}>
                    <Table variant={'simple'}>
                        <Thead>
                            <TableCaption>Marque Sua Consulta Aqui</TableCaption>
                        </Thead>
                    </Table>
                </TableContainer>
            </div>
        </main>
</>)};

export default consult;