import sharp from "sharp";
import {MapType} from "../maptype";
import {Request, Response} from "express";

export class CreateMaskMapController {
    static async maskMap(request: Request, response: Response) {
        if (request.body["images"] == null || request.body["width"] == null || request.body["height"] == null) {
            response.sendStatus(400).send("Body was not formatted properly");
            return;
        }

        const inputFiles = request.body.images;

        const [width, height] = [request.body.width, request.body.height];
        let outputImage = await sharp({
            create: {
                width,
                height,
                channels: 4, background: {r: 0, g: 0, b: 0, alpha: 1}
            }
        }).raw().toBuffer();

        for (const inputFile of inputFiles) {
            const inputSharp = sharp(Buffer.from(inputFile.image.split(';base64,').pop(), 'base64'))
            if (inputFile.mapType == MapType.Metallic) {
                outputImage = await CreateMaskMapController.putIntoChannel(inputSharp, outputImage, 0)
            } else if (inputFile.mapType == MapType.AmbientOcclusion) {
                outputImage = await CreateMaskMapController.putIntoChannel(inputSharp, outputImage, 1)
            } else if (inputFile.mapType == MapType.Detail) {
                outputImage = await CreateMaskMapController.putIntoChannel(inputSharp, outputImage, 2)
            } else {
                outputImage = await CreateMaskMapController.putIntoChannel(inputSharp, outputImage, 3, inputFile.mapType == MapType.Roughness)
            }
        }

        const compositedFile = await sharp(outputImage, {
            raw: {
                width,
                height,
                channels: 4
            }
        }).toFormat("png", {compressionLevel: 6}).toBuffer();
        const image = `data:image/png;base64,${compositedFile.toString('base64')}`
        response.send({image})
    }

    private static async putIntoChannel(inputSharp: sharp.Sharp, outputImage: Buffer, offset: number, invert: boolean = false) {
        // Invert the input image if necessary
        if (invert) {
            inputSharp = inputSharp.negate();
        }

        // Add fourth channel if necessary
        inputSharp = inputSharp.ensureAlpha();

        // Create buffer from image
        const inputBuffer = await inputSharp.raw().toBuffer();
        let outputIndex = offset;
        let inputIndex = 0;

        // Now add the average colors from each pixel of the input image to the output
        while (outputIndex < outputImage.length) {
            outputImage[outputIndex] = ((inputBuffer[inputIndex] + inputBuffer[inputIndex + 1] + inputBuffer[inputIndex + 2] + inputBuffer[inputIndex + 3]) / 4.0);
            outputIndex += 4;
            inputIndex += 4;
        }

        return outputImage;
    }
}