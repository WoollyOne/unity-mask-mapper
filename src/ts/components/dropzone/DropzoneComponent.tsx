import React from "react";
import "./dropzone.css"
import {MapType} from "../../maptype";

export interface DropzoneFile {
    fileName: string,
    fileData: string,
    fileType: string,
    width: number,
    height: number,
    mapType: MapType,
}

interface DropzoneComponentProps {
    onUpload: (file: DropzoneFile[]) => void;
    disabled: boolean;
}

interface DropzoneComponentState {
}

export default class DropzoneComponent extends React.Component<DropzoneComponentProps, DropzoneComponentState> {
    constructor(props: DropzoneComponentProps) {
        super(props);

        this.onDrop.bind(this);
    }

    private async onDropzoneClicked() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;

        input.onchange = async (event: Event) => {
            const filesList = (event.target as HTMLInputElement).files;
            const files = [];
            for (let i = 0; i < filesList.length; i++) {
                files.push(filesList.item(i))
            }
            await this.uploadAll(files);
            input.remove();
        }

        input.click();
    }

    private async onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.stopPropagation()
        event.preventDefault()

        if (this.props.disabled) {
            return;
        }

        const files = [];
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            files.push(event.dataTransfer.files.item(i));
        }

        await this.uploadAll(files);
    }

    private async uploadAll(files: File[]) {
        files = files.filter((uploaded) => {
            if (!this.isSupportedFileType(uploaded.type)) {
                alert("The file \"" + uploaded.name + "\" isn't supported. Please upload one of the following: PNG, JPG, TIFF, or BMP.")
                return false;
            }
            return true;
        })

        const dropzoneFiles: DropzoneFile[] = [];

        for (const uploaded of files) {
            const image = new Image();
            let width = 0;
            let height = 0;
            const fileReader = new FileReader();

            fileReader.onload = () => {
                image.onload = () => {
                    width = image.width;
                    height = image.height;

                    dropzoneFiles.push({
                        fileName: uploaded.name,
                        fileData: image.src,
                        fileType: uploaded.type,
                        mapType: this.calculateMapType(uploaded.name),
                        width,
                        height
                    })

                    if (dropzoneFiles.length === files.length) {
                        this.props.onUpload(dropzoneFiles)
                    }
                }

                image.src = fileReader.result as string;
            }

            fileReader.readAsDataURL(await uploaded);
        }
    }

    private isSupportedFileType(type: string) {
        return type.match(/image\/(png|jpg|jpeg|tiff|bmp)/)
    }

    private calculateMapType(name: string) {
        const nameWithoutExtension = name.split(".")[0].toLowerCase().replace(/[^a-z0-9]/gi, "");
        const baseMatchPrefix = "(.*)";
        const baseMatchSuffix = "(map)?(.*)";
        if (nameWithoutExtension.match(`${baseMatchPrefix}(ambientocclusion|ao|ambient|occlusion)${baseMatchSuffix}`)) {
            return MapType.AmbientOcclusion;
        }

        if (nameWithoutExtension.match(`${baseMatchPrefix}(metal(lic)?)${baseMatchSuffix}`)) {
            return MapType.Metallic;
        }

        if (nameWithoutExtension.match(`${baseMatchPrefix}(rough(ness)?)${baseMatchSuffix}`)) {
            return MapType.Roughness;
        }

        if (nameWithoutExtension.match(`${baseMatchPrefix}(smooth(ness)?)${baseMatchSuffix}`)) {
            return MapType.Smoothness;
        }

        return MapType.Metallic;
    }

    private onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
    }

    private onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
    }

    private onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
    }

    render() {
        let dropzoneText;
        if (this.props.disabled) {
            dropzoneText = "You've uploaded the max number of maps.";
        } else {
            dropzoneText = "Drop an image or click here to create a mask map...";
        }
        return (
            <div className={`dropzone ${this.props.disabled ? "disabled" : ""}`}
                 onClick={!this.props.disabled ? this.onDropzoneClicked.bind(this): undefined}
                 onDragOver={(event) => this.onDragOver(event)}
                 onDragEnter={(event) => this.onDragEnter(event)}
                 onDragLeave={(event) => this.onDragLeave(event)}
                 onDrop={(event) => this.onDrop(event)}>
                <div className="dropzone-inner-text">{dropzoneText}</div>
            </div>
        )
    }
}