"use strict";
{
	//Cart managing
	/*
	{
		"Product": {
			"count": 0,
			"price": 0,
			"unit": "",
			"htmlRef": object
		}
	}
	setProduct: (name: string, count: integer, price: integer, unit: string) => boolean
	setProduct: (name: string, count: integer) => boolean
	addProduct: (name: string, count: integer) => boolean

	setProduct("Sajt", 1, 1655, "db");
	setProduct("Kenyér", 1, 580, "db");
	*/
	const CURRENCY = "Ft";
	const cart = {};
	const setProduct = (name, count, price, unit) => {
		if (typeof name === "undefined" || typeof count === "undefined") {
			return false;
		}
		if (typeof cart[name] === "undefined") {
			if (typeof price === "undefined" || typeof unit === "undefined" || count <= 0) {
				return false;
			}
			cart[name] = {
				"count": count,
				"price": price,
				"unit": unit
			};
			const tr = document.createElement("tr");
			let td;
			let button;
			//name
			td = document.createElement("td");
			td.innerText = name;
			tr.appendChild(td);
			//unit price
			td = document.createElement("td");
			td.innerText = price + " " + CURRENCY + "/" + unit;
			tr.appendChild(td);
			//count
			td = document.createElement("td");
			td.innerText = count;
			tr.appendChild(td);
			//final price
			td = document.createElement("td");
			td.innerText = price * count;
			tr.appendChild(td);
			//modify
			td = document.createElement("td");
			button = document.createElement("button");
			button.onclick = () => {
				addProduct(name, 1);
			}
			button.innerText = "+";
			td.appendChild(button);
			button = document.createElement("button");
			button.onclick = () => {
				addProduct(name, -1);
			}
			button.innerText = "-";
			td.appendChild(button);
			tr.appendChild(td);
			//delete
			td = document.createElement("td");
			button = document.createElement("button");
			button.onclick = () => {
				setProduct(name, 0);
			}
			button.innerText = "←";
			td.appendChild(button);
			tr.appendChild(td);

			cart[name]["htmlRef"] = tr;
			console.log();
			document.getElementById("cart").appendChild(tr);
		} else {
			if (count <= 0) {
				cart[name]["htmlRef"].remove();
				delete cart[name];
				return true;
			} else {
				cart[name]["count"] = count;
				cart[name]["htmlRef"].children[2].innerText = count;
				cart[name]["htmlRef"].children[3].innerText = cart[name]["price"] * count;
			}
			if (typeof price !== "undefined") {
				cart[name]["price"] = price;
				cart[name]["htmlRef"].children[1].innerText = price + " " + CURRENCY + "/" + cart[name]["unit"];
				cart[name]["htmlRef"].children[3].innerText = price * cart[name]["count"];
			}
			if (typeof unit !== "undefined") {
				cart[name]["unit"] = unit;
				cart[name]["htmlRef"].children[1].innerText = cart[name]["price"] + " " + CURRENCY + "/" + unit;
			}
		}
		return true;
	};
	const addProduct = (name, count) => {
		if (typeof cart[name] === "undefined") {
			return false;
		}
		setProduct(name, cart[name]["count"] + count);
		return true;
	}

	//Video managing
	let VIDEO;
	let CANVAS
	const listVideo = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				"audio": false,
				"video": {
					"width": 640,
					"height": 480
				}
			});
			stream.getTracks()[0].stop();
			const list = await navigator.mediaDevices.enumerateDevices();
			const cameraEl = document.getElementById("cameras");
			cameraEl.innerHTML = "";
			const optionNo = document.createElement("option");
			optionNo.setAttribute("value", "");
			optionNo.innerText = "Nincs kamera";
			cameraEl.appendChild(optionNo);
			for (let i = 0, length = list.length; i < length; i++) {
				if (list[i]["kind"] === "videoinput") {
					const option = document.createElement("option");
					option.setAttribute("value", list[i]["deviceId"]);
					if (list[i]["label"].length > 20) {
						option.innerText = list[i]["label"].substring(0, 20) + "...";
					} else {
						option.innerText = list[i]["label"]
					}
					cameraEl.appendChild(option);
				}
			}
			if (cameraEl.childNodes.length > 1) {
				await setVideo(cameraEl.childNodes[1].value);
			}
		} catch (error) {
			return false;
		}
		return true;
	};
	const setVideo = async (id) => {
		const cameras = document.getElementById("cameras");
		let i = 0, length = cameras.length;
		while (i < length && cameras.options[i].value === id) {
			i++;
		}
		if (i >= cameras.length) {
			return false;
		}
		localStorage.setItem("deviceId", id);
		cameras.value = id;
		VIDEO = document.getElementById("webcam");
		if (VIDEO.srcObject !== null) {
			VIDEO.srcObject.getTracks()[0].stop();
		}
		if (id !== "") {
			try {
				VIDEO.srcObject = await navigator.mediaDevices.getUserMedia({
					"audio": false,
					"video": {
						"deviceId": id,
						"width": 640,
						"height": 480
					  }
				});
			} catch (error) {
				console.error(error);
				return false;
			}
		}
		return true;
	};
	const startVideo = async () => {
		if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
			document.getElementById("error").innerHTML = "Böngésző nem támogatott";
			return false;
		}
		navigator.mediaDevices.addEventListener("devicechange", listVideo);
		const oldDeviceId = localStorage.getItem("deviceId");
		await listVideo();
		await setVideo(oldDeviceId);
		document.getElementById("cameras").addEventListener("change", (e) => {
			setVideo(e.target.value);
		});

		CANVAS = document.getElementById("canvas");
		return true;
	}
	const drawCanvas = (name, x, y, width, height) => {
		var ctx = CANVAS.getContext("2d");
		ctx.strokeStyle = "color";
		ctx.fillStyle = "red";
		ctx.font = "20px Georgia";
		ctx.fillText(name, x + 10, y + 24);

		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.lineWidth = 2;
		ctx.rect(x, y, width, height);
		ctx.stroke();
	};
	const clearCanvas = () => {
		const ctx = CANVAS.getContext("2d");
		ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
	};

	//Object detection
	let detectionInterval = null;
	let model = null;
	const OBJECT_NAMES = [
		"Kong - energia ital (piros)",
		"Monster - expresso",
		"Pilos - kaukázusi kefir",
		"San Benedetto - ásványvíz",
		"Snack Day - tortilla (BBQ)",
		"Snack Day - tortilla (édes chili)",
		"Spar - energia ital (lila)",
		"Tonhal"
	];
	const ANCHORS = [0.573, 0.677, 1.87, 2.06, 3.34, 5.47, 7.88, 3.53, 9.77, 9.17];
	const NEW_OD_OUTPUT_TENSORS = ["detected_boxes", "detected_scores", "detected_classes"];
	const loadModel = async () => {
		//model = await cocoSsd.load();
		model = new cvstfjs.ObjectDetectionModel();
		await model.loadModelAsync("model/model.json");
	};
	const detect = async () => {
		const predictions = await model.executeAsync(VIDEO);

		clearCanvas();
		for (let i = 0, length = predictions[0].length; i < length; i++) {
			if (predictions[1][i] > 0.3) {
				const itemName = OBJECT_NAMES[predictions[2][i]];
				const itemX = (predictions[0][i][0] * CANVAS.width) + 10;
				const itemY = (predictions[0][i][1] * CANVAS.height) - 10;
				const itemWidth = (predictions[0][i][2] * CANVAS.width) - itemX + 20;
				const itemHeight = (predictions[0][i][3] * CANVAS.height) - itemY + 10;
				drawCanvas(itemName, itemX, itemY, itemWidth, itemHeight);
			}
		}

		//console.log(predictions);
		return;
	};
	const stopDetection = () => {
		if (detectionInterval !== null) {
			clearInterval(detectionInterval);
			detectionInterval = null;
		}
	};
	const startDetection = async () => {
		await loadModel();
		detectionInterval = setInterval(detect, 4000);
	};

	//Starting
	window.addEventListener("load", async () => {
		await startVideo();
		document.getElementById("status").innerHTML = "TF.js betöltése...";
		//await startDetection();
		await loadModel();
		document.getElementById("detectBtn").addEventListener("click", detect);
		document.getElementById("status").innerHTML = "";
	});
};


