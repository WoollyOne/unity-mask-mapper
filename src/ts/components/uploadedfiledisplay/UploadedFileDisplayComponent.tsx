import {DropzoneFile} from "../dropzone/DropzoneComponent";
import "./uploadedfiledisplay.css";
import React, {ChangeEvent} from "react";
import {MapType} from "../../maptype";
import {getDisplayDimensions} from "../filedisplayhelper";

interface UploadedFileDisplayComponentProps {
    dropzoneFile: DropzoneFile,
    onDeleted: (file: DropzoneFile) => void;
    onMapTypeChanged: (fileName: string, newMapType: MapType) => void;
}

interface UploadedFileDisplayComponentState {
}

export default class UploadedFileDisplayComponent extends React.Component<UploadedFileDisplayComponentProps, UploadedFileDisplayComponentState> {
    constructor(props: UploadedFileDisplayComponentProps) {
        super(props);
    }

    private onMapTypeChanged(event: ChangeEvent) {
        const target = event.target as HTMLSelectElement;
        const newTarget = target.value as MapType;
        this.props.onMapTypeChanged(this.props.dropzoneFile.fileName, newTarget);
    }

    render() {
        const file = this.props.dropzoneFile;
        const {width, height} = getDisplayDimensions(file);

        return (
            <div className="uploaded-file-display">
                <div className="file-info">
                    <div className="file-header">
                        <div className="file-name">{file.fileName}</div>
                        <a href="#" className="delete-button"
                           onClick={() => this.props.onDeleted(this.props.dropzoneFile)}><b>✖</b></a>
                    </div>
                    <label><b>Type:</b> {file.fileType}</label>
                    <label><b>Size:</b> {file.width} x {file.height}</label>
                    <div>
                        <label>Map Type:
                            <select className="map-type-select" value={this.props.dropzoneFile.mapType}
                                    onChange={this.onMapTypeChanged.bind(this)}>
                                <option value={MapType.AmbientOcclusion}>Ambient Occlusion</option>
                                <option value={MapType.Detail}>Detail Mask</option>
                                <option value={MapType.Metallic}>Metallic</option>
                                <option value={MapType.Roughness}>Roughness</option>
                                <option value={MapType.Smoothness}>Smoothness</option>
                            </select>
                        </label>
                    </div>
                </div>
                <img src={file.fileData} alt="Uploaded file" height={height} width={width}/>
            </div>)
    }
}