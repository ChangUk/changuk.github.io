const DEBUG = false;
const AUTH_MESSAGE = "U2FsdGVkX19BSw9elWK2K5nKVbmFScJVxM6QpumRDhRy1ZBOdJoVJjMC7B4Y+g2/";
const ENTRY = "0000000000000000000000";

let privateData = null;

let timer = null;
let timerDisplay = null;
const SESSION_TIME = (DEBUG ? 60 : 10) * 60 * 1000;
let CryptoJS = null;

let Renderer = null;

Element.prototype.getAncestorByTagName = function (tagName) {
	var ancestor = this;
	tagName = tagName.toLowerCase();
	while (ancestor.tagName.toLowerCase() !== "body" && ancestor.tagName.toLowerCase() !== tagName)
		ancestor = ancestor.parentNode;
	return (ancestor.tagName.toLowerCase() === "body") ? null : ancestor;
};
Element.prototype.getAncestorByClassName = function (className) {
	var ancestor = this;
	className = className.toLowerCase();
	while (ancestor.tagName.toLowerCase() !== "body" && !ancestor.classList.contains(className))
		ancestor = ancestor.parentNode;
	return (ancestor.tagName.toLowerCase() === "body") ? null : ancestor;
};

let LoadingOverlay = (function () {
	let _overlay = undefined;
	let _state = false;
	let _timer = null;
	let _callback = null;
	return {
		init: function (overlay) {
			return (_overlay = overlay) ? true : false;
		},
		show: function () {
			if (_state) return;

			// Display loading overlay with reflow
			var newOverlay = _overlay.cloneNode(true);
			_overlay.parentNode.replaceChild(newOverlay, _overlay);
			newOverlay.classList.remove("hidden");
			_overlay = newOverlay;

			_state = true;
			_timer = setInterval(function () {
				if (!_state) {
					_overlay.classList.add("hidden");
					clearInterval(_timer);
					_callback();
				}
			}, 1000);
		},
		hide: function (callback) {
			if (_state) {
				_state = false;
				_callback = callback;
			}
		},
		isDisplayed: function () {
			return _state;
		},
	};
})();

document.addEventListener("DOMContentLoaded", function () {// Initialize modules
	if (!LoadingOverlay.init(document.querySelector("#overlay-loading"))) return;
	Renderer = new DataRenderer(document.querySelector("#private-content"));

	// Auto focus on passphrase
	var inputPassphrase = document.querySelector("#input-passphrase");
	if (inputPassphrase) {
		inputPassphrase.addEventListener("keypress", function (e) {
			e.stopPropagation();
		});
		inputPassphrase.focus();
	}

	// Session test
	if (window.sessionStorage && require) {
		if (!checkSession()) signout();

		require.config({
			paths: {
				"crypto-js": "/assets/lib/crypto-js/4.0.0",
			},
		});
		require(["crypto-js/crypto-js"], function (cryptojs) {
			CryptoJS = cryptojs;

			// Authentication
			document.querySelector("#input-passphrase").addEventListener("keydown", function (e) {
				if (e.key === "Enter") {
					document.querySelector("#forbidden").classList.add("hidden");
					auth(this.value);
					this.value = "";
				} else if (e.key === "Escape") {
					this.value = "";
				}
			});

			// Timer reset
			document.querySelector("#session-timer").addEventListener("click", resetTimer);

			// If passphrase exists, authentication is automatically performed.
			var passphrase = sessionStorage.getItem("passphrase");
			if (passphrase) auth(passphrase);
		});
	} else {
		location.replace("/");
	}
});

document.onmousedown = function (e) {
	collapseAllDropdowns();
	deselectMenuItems();
	hideToc();
};

function auth(passphrase) {
	LoadingOverlay.show();
	try {
		let result = CryptoJS.AES.decrypt(AUTH_MESSAGE, passphrase).toString(CryptoJS.enc.Utf8);
		if (result) {
			sessionStorage.setItem("passphrase", passphrase);

			// Set timer
			resetTimer();

			// Debug mode
			if (DEBUG) document.querySelector("#debug-mode").classList.remove("hidden");

			// Reset private menu items
			Array.from(document.querySelector("#private-menu-items").children).forEach(function (privateItem) {
				privateItem.parentNode.removeChild(privateItem);
			});

			// Reset control menu items
			Array.from(document.querySelector("#control-menu-items").children).forEach(function (privateItem) {
				privateItem.parentNode.removeChild(privateItem);
			});

			// Clear all decrypted contents
			Renderer.clear();

			// Load private data
			fetch(DEBUG ? "/private/data.json" : "/private/data.txt").then(response => {
				if (response.ok) return response.text();
			}).then(text => {
				try {
					let decrypted = DEBUG ? text : CryptoJS.AES.decrypt(text, passphrase).toString(CryptoJS.enc.Utf8);
					if (decrypted) {
						return JSON.parse(decrypted);
					} else {
						LoadingOverlay.hide(function () {
							signout("Data decryption failed!", true);
						});
					}
				} catch (e) {
					LoadingOverlay.hide(function () {
						signout("Incomplete data!", true);
					});
					console.error(e);
				}
			}).then(json => {
				loadData(json);
			}).catch(e => {
				console.error(e);
			});
			return true;
		} else {
			LoadingOverlay.hide(function () {
				signout("Incorrect passphrase!", true);
			});
			return false;
		}
	} catch (e) {
		LoadingOverlay.hide(function () {
			signout("Unknown error is occurred!", true);
		});
		return false;
	}
}

let loadData = (data) => {
	if (!data) return;
	if (DEBUG) inspectData(data);
	
	privateData = data

	// TODO: Make `privateData` not be modified anywhere.

	Renderer.setData(privateData);

	if (privateData[ENTRY].children) {
		privateData[ENTRY].children.forEach(function (menuSetId, order) {
			var ulId = (order === 0) ? "#private-menu-items" : "#control-menu-items";
			var ul = document.querySelector(ulId);

			if (privateData[menuSetId].children) {
				privateData[menuSetId].children.forEach(function (menuItemId) {
					var menuItemObj = privateData[menuItemId];
					var li = document.createElement("li");
					li.id = "uuid-" + menuItemId;
					li.innerHTML = menuItemObj.content;
					li.addEventListener("mousedown", function (e) {
						if (e.button !== 0) {
							e.preventDefault();
							return;
						}
						collapseAllDropdowns();
						if (!this.classList.contains("selected")) {
							var dropdown = this.querySelector(".dropdown");
							if (dropdown) {
								this.classList.add("selected");
								dropdown.classList.remove("hidden");
							}
						}
						deselectMenuItems();
						hideToc();
						e.stopPropagation();
					});

					if (menuItemObj.type === "docgroup") {
						// Add caret
						li.classList.add("has-dropdown");

						// Create dropdown
						var dropdown = document.createElement("ul");
						dropdown.classList.add("dropdown", "rightward", "hidden");
						li.appendChild(dropdown);

						// Disable mouse click event over empty spaces
						dropdown.addEventListener("mousedown", function (e) {
							e.stopPropagation();
						});

						// Add dropdown items
						if (menuItemObj.children) {
							menuItemObj.children.forEach(function (dropdownItemId) {
								if (dropdownItemId) {
									var dropdownItemObj = privateData[dropdownItemId];
									var dropdownItem = document.createElement("li");
									dropdownItem.id = "uuid-" + dropdownItemId;
									dropdownItem.innerHTML = dropdownItemObj.content;
									dropdownItem.addEventListener("mousedown", function (e) {
										e.stopPropagation();
									});
									dropdownItem.addEventListener("click", function (e) {
										collapseAllDropdowns();
										deselectMenuItems();
										hideToc();
									});
									if (dropdownItemObj.type === "document") {
										dropdownItem.addEventListener("click", function (e) {
											var currentObj = privateData[this.id.replace(/^uuid-/g, "")];
											if (checkSession()) {
												resetTimer();
												Renderer.clear();

												// Render document components
												if (currentObj.children) {
													currentObj.children.forEach((childId) => {
														Renderer[privateData[childId].type](Renderer.getDOM(), childId);
													});
												}
											} else {
												signout("Session expired!");
											}
										});
									} else if (dropdownItemObj.type === "function") {
										if (dropdownItemObj.action) {
											dropdownItem.classList.add("action");
											dropdownItem.setAttribute("actions", "");
											for (const [event, action] of Object.entries(dropdownItemObj.action)) {
												var actions = dropdownItem.getAttribute("actions").split(",");
												actions.push(`${event}` + ":" + `${action}`);
												actions = actions.filter(el => { return el != ""; });
												dropdownItem.setAttribute("actions", actions.join(","));
												dropdownItem.addEventListener(`${event}`, (e) => {
													var actions = e.target.getAttribute("actions").split(",");
													for (var i = 0; i < actions.length; i++) {
														var action = actions[i].split(":");
														if (action[0] === e.type) {
															Renderer.action(privateData[action[1]]);
															break;
														}
													}
												});
											}
										}
									}
									dropdown.appendChild(dropdownItem);
								} else {
									var separator = document.createElement("li");
									separator.className = "separator";
									dropdown.appendChild(separator);
								}
							});
						}
					} else if (menuItemObj.type === "document") {
						li.addEventListener("click", function () {
							if (checkSession()) {
								resetTimer();
								Renderer.clear();

								// Render document components
								if (menuItemObj.children) {
									menuItemObj.children.forEach((childId) => {
										Renderer[privateData[childId].type](Renderer.getDOM(), childId);
									});
								}
							} else {
								signout("Session expired!");
							}
						});
					} else if (menuItemObj.type === "function") {
						if (menuItemObj.action) {
							li.classList.add("action");
							li.setAttribute("actions", "");
							for (const [event, action] of Object.entries(menuItemObj.action)) {
								var actions = li.getAttribute("actions").split(",");
								actions.push(`${event}` + ":" + `${action}`);
								actions = actions.filter(el => { return el != ""; });
								li.setAttribute("actions", actions.join(","));
								li.addEventListener(`${event}`, (e) => {
									var actions = e.target.getAttribute("actions").split(",");
									for (var i = 0; i < actions.length; i++) {
										var action = actions[i].split(":");
										if (action[0] === e.type) {
											Renderer.action(privateData[action[1]]);
											break;
										}
									}
								});
							}
						}
					}
					ul.appendChild(li);
				});
			}
		});
	}

	// Open main page
	document.querySelector("#uuid-5fXnqmbl53aqjA7bUoFcdF").click();

	LoadingOverlay.hide(authenticated);
}

function inspectData(data) {
	// TEST #1: Replace context menu with a function which enables direct inspection of an element
	document.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		function getElId(el) {
			if (!el) return;
			var id = el.id;
			if (id && /^uuid-[a-f0-9]{32}/.exec(id)) {
				var match = id.replace(/^uuid-/g, "").match(/\b[a-f0-9]{32}\b/);
				if (match && match[0]) console.log(match[0], data[match[0]]);
				else getElId(el.parentNode);
			} else getElId(el.parentNode);
		}
		getElId(e.target);
	});

	// TEST #2: Set reference counts for each data items
	let reference = (parent, id) => {
		if (!id || id.length !== 32) return;
		if (data.hasOwnProperty(id)) {
			var obj = data[id];
			if (!obj.hasOwnProperty("parents")) obj.parents = [];
			obj.parents.push({
				id: parent,
				obj: data[parent]
			});
			if (obj.children)
				obj.children.forEach(childId => { reference(id, childId); });
			if (obj.content && typeof obj.content === "object")
				Object.keys(obj.content).forEach((key) => { reference(id, obj.content[key]); });
			if (obj.properties)
				reference(id, obj.properties);
			if (obj.action && typeof obj.action === "object")
				Object.keys(obj.action).forEach((key) => { reference(id, obj.action[key]); });
		} else console.log("--- Broken pointer: parent('" + parent + "') -> target('" + id + "')");
	}
	reference(null, ENTRY);

	// TEST #3: Check if invalid data exists and get parent object
	var multiRefs = [];
	var standalone = {};
	Object.keys(data).forEach(id => {
		var obj = data[id];
		if (obj.hasOwnProperty("parents")) {
			if (obj.parents.length > 1)
				multiRefs.push({ id: id, count: obj.parents.length });
		} else standalone[id]=(obj);
	});
	multiRefs.msort([{ key: "count", order: "descending" }]);
	if (multiRefs.length) {
		console.log("--- Multi-referenced objects: ");
		multiRefs.forEach((obj, order) => {
			var item = data[obj.id];
			if (item.type !== "action" && item.type !== "spreadsheetProp" && item.type !== "tableProp")
				console.log(obj.id, item);
		});
	}
	if (Object.keys(standalone).length) {
		console.log("--- Standalone objects: ");
		for (const [id, obj] of Object.entries(standalone))
			console.log(id, obj);
	}
}

function signout(msg, shake = false) {
	if (timer) clearTimeout(timer);

	Renderer.clear();
	sessionStorage.removeItem("passphrase");
	sessionStorage.removeItem("expire");
	privateData = null;

	document.querySelector("#forbidden").classList.remove("hidden");
	document.querySelector("#input-passphrase").focus();
	document.querySelector("#private-wrapper").classList.add("hidden");

	var el = document.querySelector("#auth-message");
	if (msg && typeof msg === "string") {
		el.innerHTML = msg;
		if (shake) ShakeElement(el, 30, 3);
	} else el.innerHTML = "";
}
function authenticated() {
	document.querySelector("#forbidden").classList.add("hidden");
	document.querySelector("#private-wrapper").classList.remove("hidden");
}
function resetTimer() {
	if (timer) clearTimeout(timer);
	timer = setTimeout(function () {
		signout("Session expired!", true);
	}, SESSION_TIME);

	if (timerDisplay) clearTimeout(timerDisplay);
	var remaining = ~~(SESSION_TIME / 1000);
	function displayTimer() {
		timerDisplay = setTimeout(displayTimer, 1000);
		var min = String("00" + ~~(remaining / 60)).slice(-2);
		var sec = String("00" + ~~(remaining % 60)).slice(-2);
		document.querySelector("#session-timer").innerHTML = min + ":" + sec;
		remaining -= 1;
	}
	displayTimer();

	sessionStorage.setItem("expire", Date.now() + SESSION_TIME);
}
function checkSession() {
	try {
		var expire = parseInt(sessionStorage.getItem("expire"));
		return sessionStorage.getItem("passphrase") && Date.now() < expire;
	} catch {
		return false;
	}
}

function collapseAllDropdowns() {
	Array.from(document.querySelectorAll(".dropdown")).forEach(function (dropdown) {
		dropdown.classList.add("hidden");
	});
}

function deselectMenuItems() {
	Array.from(document.querySelectorAll(".private-menu > ul")).forEach(function (ul) {
		Array.from(ul.children).forEach(function (menuItem) {
			menuItem.classList.remove("selected");
		});
	});
}

function hideToc() {
	var toc = document.querySelector("toc");
	if (toc) toc.classList.add("hidden");
}

let EmbeddedFunctions = (function () {
	return {
		exportData: function () {
			var original = JSON.parse(JSON.stringify(privateData));
			for (const [key, obj] of Object.entries(original)) delete obj["parents"];
			var blob = new Blob([JSON.stringify(original, null, 4)], { type: "application/json" });
			var a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = "data.json";
			a.click();

			// import("/assets/lib/short-uuidv4/1.0.1/short-uuidv4.js")
			// .then(mod => {
			// 	let ShortUuidV4 = mod.ShortUuidV4;
			// 	let generator = new ShortUuidV4();
			// 	function translate(key) {
			// 		let uuidv4 = generator.formatUuidV4(key);
			// 		return generator.translate(uuidv4, ShortUuidV4.BASE_HEX, ShortUuidV4.BASE_DEF);
			// 	}
			// 	let newData = {};
			// 	for (const [key, obj] of Object.entries(original)) {
			// 		newData[translate(key)] = obj;
			// 	}
			// 	for (const [key, obj] of Object.entries(newData)) {
			// 		if (obj.hasOwnProperty("children")) {
			// 			let newChildren = [];
			// 			obj.children.forEach(child => {
			// 				if (child.length == 32) newChildren.push(translate(child));
			// 			});
			// 			obj.children = newChildren;
			// 		}
			// 		if (obj.hasOwnProperty("properties") && obj.properties.length == 32) {
			// 			obj.properties = translate(obj.properties);
			// 		}
			// 		if (obj.hasOwnProperty("content") && typeof obj.content === "object" && obj.content) {
			// 			let newObject = JSON.parse(JSON.stringify(obj.content));
			// 			if (obj.content.hasOwnProperty("header") && obj.content.header.length == 32)
			// 				newObject.header = translate(obj.content.header);
			// 			if (obj.content.hasOwnProperty("body") && obj.content.body.length)
			// 				newObject.body = translate(obj.content.body);
			// 			if (obj.content.hasOwnProperty("footer") && obj.content.footer.length == 32)
			// 				newObject.footer = translate(obj.content.footer);
			// 			obj.content = newObject;
			// 		}
			// 		if (obj.hasOwnProperty("action") && typeof obj.action === "object" && obj.action) {
			// 			let newObject = JSON.parse(JSON.stringify(obj.action));
			// 			if (obj.action.hasOwnProperty("click") && obj.action.click.length == 32)
			// 				newObject.click = translate(obj.action.click);
			// 			obj.action = newObject;
			// 		}
			// 	}
			// 	var blob = new Blob([JSON.stringify(newData, null, 4)], { type: "application/json" });
			// 	var a = document.createElement("a");
			// 	a.href = URL.createObjectURL(blob);
			// 	a.download = "data.json";
			// 	a.click();
			// });
		}
	};
})();
