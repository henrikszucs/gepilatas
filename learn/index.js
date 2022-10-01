"use strict";
{
    //process image
    let ANALYSE_DATA = "";
    const analyse = async (blob) => {
        const imageData = await blobToImageData(blob);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        //console.log(data);
        //console.log(width);
        //console.log(height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = getRedCoord(x, y, width);
                if (data[i + 3] === 255) {
                    console.log(x);
                    console.log(y);
                }
            }
        }
    };
    const blobToImageData = async (blob) => {
        return new Promise(function (resolve, reject) {
            const img = new Image();
            img.onload = function(){
                const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                /*//test
                canvas.toBlob((blob) => {
                    console.log(URL.createObjectURL(blob));
                });*/

                resolve(imageData);
            }
            img.src = URL.createObjectURL(blob);
        });
    }
    const getRedCoord = (x, y, width) => {
        return (x * 4) + (width * 4 * y);
    };

    //load image
    let INPUT = null;
    let MESSAGE = null;
    let TEXTAREA = null;
    window.addEventListener("load", function () {
        INPUT = document.getElementById("input");
        MESSAGE = document.getElementById("message");
        TEXTAREA = document.getElementById("textarea");

        INPUT.addEventListener("change", async function(event) {
            let i = 0;
            const length = event.target.files.length;
            MESSAGE.innerHTML = "Feldolgozva: " + i + "/" + length;
            while (i < length) {
                await analyse(event.target.files[i]);
                i++;
                MESSAGE.innerHTML = "Feldolgozva: " + i + "/" + length;
            }
            TEXTAREA.value = ANALYSE_DATA;
        });
    });
};