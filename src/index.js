"use strict";
{
	/*
	{
		"Product": {
			"count": 0,
			"price": 0,
			"unit": "",
			"htmlRef": object
		}
	}
	*/
	const CURRENCY = "Ft";
	const cart = {};
	const setProduct = (name, count, price, unit) => {
		if (typeof name === "undefined" || typeof count === "undefined") {
			return false;
		}
		if (typeof cart[name] === "undefined") {
			if (typeof price === "undefined" || typeof unit === "undefined" || count === 0) {
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
			if (count === 0) {
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


	window.addEventListener("load", function() {
		setProduct("Sajt", 2, 100, "db");
		setProduct("Sajt", 20, 100, "db");
		setProduct("Sajt", 20, 1000, "db");
		addProduct("Sajt", 2);
	});
};


