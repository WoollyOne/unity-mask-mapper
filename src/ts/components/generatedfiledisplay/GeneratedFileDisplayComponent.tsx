import {DropzoneFile} from "../dropzone/DropzoneComponent";
import "./generatedfiledisplay.css";
import React from "react";
import {getDisplayDimensions} from "../filedisplayhelper";
import {MapType} from "../../maptype";
import LoadingDisplayComponent from "./loadingdisplay/LoadingDisplayComponent";

interface GeneratedFileDisplayComponentProps {
    uploadedFiles: DropzoneFile[],
}

interface GeneratedFileDisplayComponentState {
    outputFile?: DropzoneFile,
    isLoading: boolean;
}


export default class GeneratedFileDisplayComponent extends React.Component<GeneratedFileDisplayComponentProps, GeneratedFileDisplayComponentState> {
    constructor(props: GeneratedFileDisplayComponentProps) {
        super(props);
        this.state = {outputFile: undefined, isLoading: false}
    }

    componentDidMount() {
        this.updateOutputFile();
    }

    componentDidUpdate(prevProps: GeneratedFileDisplayComponentProps, prevState: GeneratedFileDisplayComponentState) {
        if (prevProps.uploadedFiles.length == this.props.uploadedFiles.length) {
            if (JSON.stringify(prevProps.uploadedFiles) === JSON.stringify(this.props.uploadedFiles)) {
                return;
            }
        }

        this.updateOutputFile();
    }

    private updateOutputFile() {
        this.setState({outputFile: undefined, isLoading: true});
        this.generateOutputFile().then((outputFile) => {
            this.setState({outputFile, isLoading: false});
        })
    }

    private async generateOutputFile(): Promise<DropzoneFile | undefined> {
        if (this.props.uploadedFiles.length == 0) {
            return undefined;
        }

        const firstFile = this.props.uploadedFiles[0];
        const [width, height] = [firstFile.width, firstFile.height]
        let responseJson = {"image": ""};

        try {
            const response = await fetch('/mask-map', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    "images": this.props.uploadedFiles.map(inputFile => (
                        {
                            "image": inputFile.fileData, "mapType": inputFile.mapType
                        })
                    ),
                    "width": firstFile.width,
                    "height": firstFile.height,
                }),
            });


        const responseJson = await response.json();
        if (responseJson == null || responseJson["image"] == null) {
            console.error("Failed to create mask map.");
            return undefined;
        }
        } catch (error) {
            console.error("Internal server error");
            return undefined;
        }

        return {
            fileData: responseJson["image"],
            width,
            height,
            mapType: MapType.MaskMap,
            fileType: "image/png",
            fileName: "generated-mask-map.png",
        };
    }

    private downloadOutputImage() {
        const link = document.createElement('a');
        link.href = this.state.outputFile.fileData;
        link.download = this.state.outputFile.fileName;
        link.click();
        link.remove();
    }

    render() {
        const outputFile = this.state.outputFile;
        const isLoading = this.state.isLoading;
        const {width, height} = getDisplayDimensions(outputFile);

        return (
            <div className="generated-file-display">
                <div className="output-header">
                    <h3>Output Mask Map</h3>
                    <p className="download-button" onClick={this.downloadOutputImage.bind(this)}>Click to download</p>
                </div>
                <div className="file-display-container">
                    {isLoading && <LoadingDisplayComponent/>}
                    {outputFile && !isLoading &&
                        <div className="checker">
                            <div
                                onClick={this.downloadOutputImage.bind(this)}
                                className="file-display-image" style={{
                                backgroundImage: `url(${outputFile.fileData})`,
                                width: `${width}px`,
                                height: `${height}px`
                            }}>
                            </div>
                        </div>}
                </div>
            </div>
        )
    }
}