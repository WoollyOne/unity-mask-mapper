import React from "react";
import "./main.css";
import DropzoneComponent, {DropzoneFile} from "./dropzone/DropzoneComponent";
import {MapType} from "../maptype";
import UploadedFileDisplayComponent from "./uploadedfiledisplay/UploadedFileDisplayComponent";
import GeneratedFileDisplayComponent from "./generatedfiledisplay/GeneratedFileDisplayComponent";
import koFiButton from "../../img/ko-fi-button.png";

type MainComponentState = {
    uploadedFiles: DropzoneFile[],
    warningMessages: string[],
    outputFile?: DropzoneFile;
    isLoadingOutputFile: boolean;
}

type MainComponentProps = {}

export default class MainComponent extends React.Component<MainComponentProps, MainComponentState> {
    constructor(props: MainComponentProps) {
        super(props);
        this.state = {
            uploadedFiles: [],
            warningMessages: [],
            outputFile: undefined,
            isLoadingOutputFile: false,
        }
    }

    private onUpload(files: DropzoneFile[]) {
        const uploadedFiles = this.state.uploadedFiles;
        const dropzoneFiles = [];
        for (const file of files) {
            if (uploadedFiles.length + dropzoneFiles.length === 4) {
                alert(`Failed to add ${file.fileName}. Couldn't upload all of your files, there is a limit of 4.`)
                break;
            }

            if (!uploadedFiles.every((uploadedFile) => file.fileData != uploadedFile.fileData && file.fileName != uploadedFile.fileName)) {
                alert(`Failed to add ${file.fileName}. Duplicate file uploaded. Please only upload one copy of a given file.`)
                continue;
            }

            if (uploadedFiles.length > 0 && (uploadedFiles[0].width != file.width || uploadedFiles[0].height != file.height)) {
                alert(`Failed to add ${file.fileName}. Please only upload files with the same dimensions.`)
                continue;
            }

            dropzoneFiles.push(file);
        }

        const newFiles = [...this.state.uploadedFiles, ...dropzoneFiles];
        this.setState({
            ...this.state,
            uploadedFiles: newFiles,
            warningMessages: this.getMapWarnings(newFiles.map(file => file.mapType)),
            isLoadingOutputFile: true,
        });
    }

    private onDeleted(file: DropzoneFile) {
        const newFiles = this.state.uploadedFiles.filter(uploadedFile => uploadedFile.fileName != file.fileName);
        this.setState({
            ...this.state,
            uploadedFiles: newFiles,
            warningMessages: this.getMapWarnings(newFiles.map(file => file.mapType)),
        })
    }

    private onMapTypeChanged(fileName: string, newMapType: MapType) {
        const uploadedFiles = this.state.uploadedFiles.map(uploadedFile => {
            if (uploadedFile.fileName === fileName) {
                return {...uploadedFile, mapType: newMapType}
            }
            return uploadedFile;
        });

        this.setState({
            ...this.state,
            uploadedFiles,
            warningMessages: this.getMapWarnings(uploadedFiles.map((file) => file.mapType)),
        });
    }

    private getMapWarnings(mapTypes: MapType[]) {

        const warningMessages = [];
        const mapTypesUploaded = new Set(mapTypes);
        if (mapTypesUploaded.size < mapTypes.length) {
            warningMessages.push("Please make sure there are no duplicate map types.")
        }

        if (mapTypesUploaded.has(MapType.Roughness) && mapTypesUploaded.has(MapType.Smoothness)) {
            warningMessages.push("You can't have a smoothness map and a roughness map at the same time. Please remove one.")
        }

        return warningMessages;
    }

    private onDonationButtonClicked() {
        const a = document.createElement('a');
        a.href = "https://Ko-fi.com/woollyone";
        a.target = "_blank";
        a.click();
        a.remove();
    }

    render() {
        const uploadedFileComponents = this.state.uploadedFiles.map((file, i) =>
            <UploadedFileDisplayComponent dropzoneFile={file} onMapTypeChanged={this.onMapTypeChanged.bind(this)}
                                          onDeleted={this.onDeleted.bind(this)} key={i}/>);
        const warningMessages = this.state.warningMessages.map((message, i) =>
            <h3 key={i} className="warning-message">{message}</h3>
        )
        return (
            <div className="container">
                <div className="header">
                    <div className="beta-label">BETA</div>
                    <h1>Unity Mask Mapper by WoollyOne</h1>
                    <img
                        alt="I like money"
                        onClick={this.onDonationButtonClicked.bind(this)}
                        className="ko-fi-button"
                        src={koFiButton}
                        width="150"
                        height="41"
                    />
                </div>
                <div>{warningMessages}</div>
                <div className="item-container">
                    <DropzoneComponent disabled={this.state.uploadedFiles.length === 4}
                                       onUpload={this.onUpload.bind(this)}></DropzoneComponent>
                    <div className="image-container">
                        {uploadedFileComponents}
                        {this.state.uploadedFiles.length > 0 && this.state.warningMessages.length === 0 &&
                            <GeneratedFileDisplayComponent uploadedFiles={this.state.uploadedFiles}/>}
                    </div>
                </div>
            </div>)
    }
}
