import React, { Fragment, useEffect, useState } from 'react';
import { LOADING_TITLE } from 'constants/texts';
import { useSelector } from 'react-redux';
import { ICON_DONE } from 'constants/images';
import { useNavigate } from 'react-router';
import { convertFileSize } from 'utils/common';
import { DoneIcon, Filename, Filesize, LoadingTitle, Percentage, ProgressBox } from './styles';
import Progress from 'components/progress/progress';
import { isDesktop } from 'react-device-detect';

export default function LoadingBox() {
    const { file, fileHash } = useSelector(state => state.files);

    const navigate = useNavigate();

    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timer;
        if(loading){
            timer = setInterval(() => {
                setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
            }, 100);
        }

        return () => {
            clearInterval(timer);
            setProgress(0);
        }
    }, [file, fileHash]);

    useEffect(() => {
        let timer;
        let count = 0;
        if(loading === false) {
            timer = setInterval(() => {
                count += 500;
                if(count >= 1000){
                    navigate(`/verification/${fileHash}`);
                    clearInterval(timer);
                }
            }, 500);
        }
    }, [loading])

    useEffect(() => {
        let timer;
        if((file !== null || fileHash !== "") && progress >= 100) {
            timer = setInterval(() => {
                setLoading(false);
                clearInterval(timer);
            }, 500);
        }
    }, [progress])

    return (
        <Fragment>
            <LoadingTitle isDesktop={isDesktop}>{LOADING_TITLE}</LoadingTitle>
            <ProgressBox>
                <Progress value={progress}/>
                {progress >= 100 && loading === false?
                <DoneIcon src={ICON_DONE} alt="Upload Complete" />          
                :
                <Percentage>{progress}%</Percentage>
                }
            </ProgressBox>
            {file !== null &&
                <Fragment>
                    <Filename isDesktop={isDesktop}>{file.name}</Filename>
                    <Filesize isDesktop={isDesktop}>{convertFileSize(file.size)}KB</Filesize>
                </Fragment>
            }
        </Fragment>
    )
}
