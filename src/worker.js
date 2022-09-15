"use strict";
self.importScripts("tensorflow.js");
self.importScripts("tensorflow.microsoft.js");

let model;
const loadModel = async () => {
    //model = await cocoSsd.load();
    model = new cvstfjs.ObjectDetectionModel();
    await model.loadModelAsync("model/model.json");
};
const detect = async (data) => {
    return await model.executeAsync(data);
};

self.addEventListener("message", async (e) => {
    if (e.data === "load") {
        await loadModel();
        postMessage("loaded");
    } else if (typeof e.data  === "object") {
        const image = new ImageData(e.data["data"], e.data["width"], e.data["height"], {"colorSpace": e.data["colorSpace"]});
        const predictions = detect(image);
        postMessage(await predictions);
    }
});