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
	const listProducts = () => {
		return Object.keys(cart);
	};
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
			//delete btn
			td = document.createElement("td");
			button = document.createElement("button");
			button.onclick = () => {
				setProduct(name, 0);
			}
			button.innerText = "←";
			td.appendChild(button);
			tr.appendChild(td);

			cart[name]["htmlRef"] = tr;
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
	};
	const clearCart = () => {
		const items = Object.keys(cart);
		for (let i = 0, length = items.length; i < length; i++) {
			setProduct(items[i], 0);
		}
	};
	const addCart = () => {
		for (let itemName in VIEWCART) {
			if (addProduct(itemName, VIEWCART[itemName]["count"]) === false) {
				setProduct(itemName, VIEWCART[itemName]["count"], VIEWCART[itemName]["price"], VIEWCART[itemName]["unit"]);
			}
		}
	};
	const setCart = () => {
		clearCart();
		addCart();
	};

	//Video managing
	let VIDEO;
	let CANVAS;
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
			cameraEl.onchange = (e) => {
				setVideo(e.target.selectedIndex);
			};
			cameraEl.innerHTML = "";
			const optionNo = document.createElement("option");
			optionNo.setAttribute("value", "0");
			optionNo.innerText = "Nincs kamera";
			cameraEl.appendChild(optionNo);
			const optionVideo = document.createElement("option");
			optionVideo.setAttribute("value", "1");
			optionVideo.innerText = "Videó";
			cameraEl.appendChild(optionVideo);
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
			if (cameraEl.childNodes.length > 2) {
				await setVideo(2);
			}
			
		} catch (error) {
			return false;
		}
		return true;
	};
	const setVideo = async (index) => {
		const cameras = document.getElementById("cameras");
		if (typeof cameras.options[index] === "undefined") {
			return false;
		}
		localStorage.setItem("index", index);
		cameras.value = cameras.options[index].value;

		removeVideo();
		if (index === 1) {
			document.getElementById("loadBtn").classList.remove("removed");
			document.getElementById("playBtn").classList.remove("removed");
			document.getElementById("pauseBtn").classList.remove("removed");
		} else {
			document.getElementById("loadBtn").classList.add("removed");
			document.getElementById("playBtn").classList.add("removed");
			document.getElementById("pauseBtn").classList.add("removed");
		}

		if (index > 1) {
			try {
				VIDEO.srcObject = await navigator.mediaDevices.getUserMedia({
					"audio": false,
					"video": {
						"deviceId": cameras.value,
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
	const setVideoFile = async () => {
		return new Promise((resolve, reject) => {
			removeVideo();

			const input = document.createElement("input");
			input.type = "file";
			input.accept = "video/*,image/*";
			input.onchange = async (e) => {
				VIDEO.src = URL.createObjectURL(e.target.files[0]);
				VIDEO.load();
				VIDEO.onloadeddata = () => {
					VIDEO.play();
					resolve(true);
				}
			};
			input.click();
		});
	};
	const removeVideo = () => {
		VIDEO = document.getElementById("webcam");
		if (VIDEO.srcObject !== null) {
			VIDEO.srcObject.getTracks().forEach(track => {
				track.stop()
				VIDEO.srcObject.removeTrack(track);
			});
			VIDEO.srcObject = null;
		}
		
		const ObjectUrl = VIDEO.src;
		if(ObjectUrl && ObjectUrl.startsWith("blob:")) {
			URL.revokeObjectURL(ObjectUrl);
		}
		VIDEO.src = "";
	};
	const startVideo = async () => {
		if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
			document.getElementById("error").innerHTML = "Böngésző nem támogatott";
			return false;
		}
		navigator.mediaDevices.addEventListener("devicechange", listVideo);

		await listVideo();
		document.getElementById("loadBtn").addEventListener("click", setVideoFile);
		document.getElementById("playBtn").addEventListener("click", () => {
			VIDEO.play();
		});
		document.getElementById("pauseBtn").addEventListener("click", () => {
			VIDEO.pause();
		});
		await setVideo(localStorage.getItem("index"));

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
	let worker = null;
	let detectionInterval = null;
	let isWorking = false;
	let VIEWCART = {};
	const loadWorker = async () => {
		return new Promise((resolve, reject) => {
			worker = new Worker("worker.js");
			worker.onmessage = (event) =>{
				if (event.data === "loaded") {
					resolve(true);
				}
			};
			worker.postMessage("load");
		});
	};
	const detect = async () => {
			try {
				if (!isWorking) {
					isWorking = true;

					const canvas = document.createElement("canvas");
					canvas.width = CANVAS.width;
					canvas.height = CANVAS.height;
					const ctx = canvas.getContext("2d");
					ctx.drawImage(VIDEO, 0, 0, VIDEO.videoWidth, VIDEO.videoHeight, 0, 0, canvas.width, canvas.height);
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					const data = imageData.data;
					const width = imageData.width;
					const height = imageData.height;
					const colorSpace = imageData.colorSpace;
					worker.onmessage = (event) => {
						if (typeof event.data === "object") {
							const predictions = event.data;
							VIEWCART = {};
							clearCanvas();
							for (let i = 0, length = predictions.length; i < length; i++) {
								drawCanvas(predictions[i]["itemName"], predictions[i]["itemX"], predictions[i]["itemY"], predictions[i]["itemWidth"], predictions[i]["itemHeight"]);
								if (typeof VIEWCART[predictions[i]["itemName"]] === "undefined") {
									VIEWCART[predictions[i]["itemName"]] = {
										"count": 1,
										"price": predictions[i]["itemPrice"],
										"unit": predictions[i]["itemUnit"]
									};
								} else {
									VIEWCART[predictions[i]["itemName"]]["count"]++;
								}
							}
							console.log(predictions);
							isWorking = false;
						}
					};
					worker.postMessage({
						"data": data,
						"width": width,
						"height": height,
						"colorSpace": colorSpace
					}, [data.buffer]);
				}
				
			} catch (error) {
				isWorking = false;
				console.log(error);
			}
		
	};
	const startDetection = () => {
		detectionInterval = setInterval(detect, 200);
	};
	const stopDetection = () => {
		if (detectionInterval !== null) {
			clearInterval(detectionInterval);
			detectionInterval = null;
		}
	};
	
	//Starting
	window.addEventListener("load", async () => {
		document.getElementById("addCartBtn").addEventListener("click", addCart);
		document.getElementById("setCartBtn").addEventListener("click", setCart);
		document.getElementById("status").innerHTML = "Videó betöltése...";
		await startVideo();
		document.getElementById("status").innerHTML = "TF.js betöltése...";
		await loadWorker();
		startDetection();
		document.getElementById("status").innerHTML = "";
	});
};


