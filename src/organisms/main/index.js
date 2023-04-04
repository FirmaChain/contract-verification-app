import React, { useEffect } from "react";
import { Box, DescText, StyledLink } from "components/styles";
import { FilesActions, ProcessActions } from "redux/actions";
import { MAIN_DESC } from "constants/texts";
import { isDesktop } from "react-device-detect";
import { ButtonBox } from "./styles";
import RectButton from "components/button/rectButton";
import DemoButton from "components/button/demoButton";
import Cards from "./cards";
import { useNavigate } from "react-router";
import { getVirifyResult } from "utils/firma";

const { demoContract, demoPrefix } = require("../../config");

export default function Main() {
    const navigate = useNavigate();

    useEffect(() => {
        FilesActions.setFile(null);
        FilesActions.setMetaJson(null);
        ProcessActions.setVerifyStep(0);
        ProcessActions.setDemo({
            status: false,
            privateKey: "",
        });
    }, []);

    const handleDemo = async () => {
        const response = await fetch(demoContract);
        const data = await response.blob();
        const meta = {
            type: "application/pdf",
        };
        const fileName = "sample_contract.pdf";
        const file = new File([data], fileName, meta);
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async function () {
            const buffer = new Uint8Array(reader.result);

            const result = {
                name: file.name,
                size: file.size,
                buffer: buffer,
            };
            await verifyContract(result);
            ProcessActions.setDemo({
                status: true,
                privateKey: "",
            });
            ProcessActions.setVerifyStep(1);
            navigate("/upload");
        };
    };

    const verifyContract = async (file) => {
        try {
            const result = await getVirifyResult(file.buffer, "", demoPrefix);
            FilesActions.setFile({
                name: file.name,
                size: file.size,
                ...result,
            });
        } catch (error) {
            throw error;
        }
    };

    return (
        <Box direction={"column"}>
            <DescText isDesktop={isDesktop} style={{ padding: "16px 0 0" }}>
                {MAIN_DESC}
            </DescText>
            <Cards />
            <ButtonBox isDesktop={isDesktop}>
                <DemoButton title="DEMO" small={isDesktop === false} onClickEvent={handleDemo} />
                <StyledLink to="/upload">
                    <RectButton title="VERIFICATION" small={isDesktop === false} />
                </StyledLink>
            </ButtonBox>
        </Box>
    );
}
