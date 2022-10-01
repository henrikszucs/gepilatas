"use strict";
self.importScripts("tensorflow.js");
self.importScripts("tensorflow.microsoft.js");
{
    //tensorflow
    const objectNames = [
		"Kong - energia ital (piros)",
		"Monster - expresso",
		"Pilos - kaukázusi kefir",
		"San Benedetto - ásványvíz",
		"Snack Day - tortilla (BBQ)",
		"Snack Day - tortilla (édes chili)",
		"Spar - energia ital (lila)",
		"Tonhal"
	];
    const objectPrices = [
		129,
		330,
		350,
		300,
		329,
		329,
		139,
		510
	];
    const objectUnits = [
		"db",
		"db",
		"db",
		"db",
		"db",
		"db",
		"db",
		"db"
	];
    let model;
    const loadModel = async () => {
        model = new cvstfjs.ObjectDetectionModel();
        await model.loadModelAsync("model/model.json");
    };
    const detect = async (data) => {
        const result = [];
        const predictions = await model.executeAsync(data);
        for (let i = 0, length = predictions[0].length; i < length; i++) {
            if (predictions[1][i] > 0.3) {
                const resultObj = {};
                resultObj["itemName"] = objectNames[predictions[2][i]];
                resultObj["itemPrice"] = objectPrices[predictions[2][i]];
                resultObj["itemUnit"] = objectUnits[predictions[2][i]];
                resultObj["itemX"] = (predictions[0][i][0] * data.width) + 10;
                resultObj["itemY"] = (predictions[0][i][1] * data.height) - 10;
                resultObj["itemWidth"] = (predictions[0][i][2] * data.width) - resultObj["itemX"] + 20;
                resultObj["itemHeight"] = (predictions[0][i][3] * data.height) - resultObj["itemY"] + 10;
                result.push(resultObj);
            }
        }
        return result;
    };

    //calling
    self.addEventListener("message", async (e) => {
        if (e.data === "load") {
            await loadModel();
            postMessage("loaded");
        } else if (typeof e.data  === "object") {
            const image = new ImageData(e.data["data"], e.data["width"], e.data["height"], {"colorSpace": e.data["colorSpace"]});
            const predictions = await detect(image);
            postMessage(predictions);
        }
    });

    //s
    const getImageDataRedPixelCoord = (x, y, width) => {
        return (x * 4) + (width * 4 * y);
    };
};