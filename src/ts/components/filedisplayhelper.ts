import {DropzoneFile} from "./dropzone/DropzoneComponent";

export function getDisplayDimensions(file?: DropzoneFile): { width: number, height: number } {
    if (!file) {
        return {width: 0, height: 0};
    }

    const ratio = file.width / file.height;
    let width;
    let height;
    if (ratio > 1) {
        width = 300;
        height = width / ratio;
    } else {
        height = 300;
        width = height * ratio;
    }

    return {width, height}
}