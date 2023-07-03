import Head from "next/head";
import {
    TableContainer,
    Table, Thead, TableCaption, Th, Tr, extendTheme,
} from "@chakra-ui/react";

const consult = () => {
    return (<>
        <main>
            <div className="flex justify-center items-center h-screen w-full">
                <div className={`
                    bg-primary text-primary
                    shadow-sm rounded-lg gap-8 p-6
                `}>
                    <div className={`
                        flex justify-center 
                        w-full
                    `}>
                        <span className="text-2xl text-boxText border-0">
                            Marque sua consulta
                        </span>
                    </div>
                    <div className={`
                        bg-box
                    `}>
                        <Table>
                            <Thead>
                                <Tr color="white">
                                    <Th><span
                                        className={"text-boxText"}>Segunda Feira
                                    </span></Th>
                                    <Th><span
                                        className={"text-boxText"}>Segunda Feira
                                    </span></Th>
                                    <Th><span
                                        className={"text-boxText"}>Segunda Feira
                                    </span></Th>
                                    <Th><span
                                        className={"text-boxText"}>Segunda Feira
                                    </span></Th>
                                </Tr>
                            </Thead>
                        </Table>
                    </div>
                </div>
            </div>
        </main>
    </>);};

export default consult;