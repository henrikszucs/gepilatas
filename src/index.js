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
	setProduct(name:string, count:integer, price:integer (optional), unit:string (optional));
	true / false
	addProduct(name:string, count:integer);
	true / false

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
	}

	//Video managing
	let VIDEO;
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
			console.log(error);
		}
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
	const videoStart = async () => {
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
		return true;
	}

	//Starting
	window.addEventListener("load", async () => {
		await videoStart();
	});
};


