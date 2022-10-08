import {Request, Response} from "express";
import {CreateMaskMapController} from "./ts/server/CreateMaskMapController";

const path = require('path');
const express = require('express');
const openJs = require('open');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended: true})

console.log("SERVER:", process.env.NODE_ENV);

// create express application
const app = express();

// find available port (if not 3000)
const port = 3002;
const host = `http://127.0.0.1:${port}`;

/*-------------------*/
// endpoint to serve web assets
app.use('/unity-mask-mapper', express.static('dist/public'));
app.use(bodyParser.json({limit: '20mb'}));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/mask-map', jsonParser, async (request: Request, response: Response) => {
    await CreateMaskMapController.maskMap(request, response);
});

app.listen(port, async () => {
    console.log(`Unity Mask Mapper is running on port ${port}!`);
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
        openJs(`${host}/unity-mask-mapper`); // opens `web/index.html` page
    }
});