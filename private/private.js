const DEBUG = false;
const AUTH_MESSAGE = "U2FsdGVkX19BSw9elWK2K5nKVbmFScJVxM6QpumRDhRy1ZBOdJoVJjMC7B4Y+g2/";

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

document.addEventListener("DOMContentLoaded", function () {
	// Initialize modules
	if (!LoadingOverlay.init(document.querySelector("#overlay-loading"))) return;
	Renderer = new DataRenderer(document.querySelector("#private-content"));

	// Session test
	if (window.sessionStorage && require) {
		if (!checkSession()) signout();

		require.config({
			paths: {
				"crypto-js": "../assets/lib/crypto-js/4.0.0",
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
			var xhr = new XMLHttpRequest();
			xhr.passphrase = passphrase;
			xhr.open("GET", DEBUG ? "data.json" : "data.txt");
			xhr.addEventListener("readystatechange", loadData);
			xhr.send();
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

let loadData = (e) => {
	const ENTRY = "00000000000000000000000000000000";

	// The operation is complete.
	var xhr = e.target;
	if (xhr.readyState === 4 && xhr.status === 200) {
		try {
			var decrypted = DEBUG ? xhr.responseText : CryptoJS.AES.decrypt(xhr.responseText, xhr.passphrase).toString(CryptoJS.enc.Utf8);
			if (decrypted) {
				privateData = JSON.parse(decrypted);

				if (DEBUG) {
					// TEST #1: Replace context menu with a function which enables direct inspection of an element
					document.addEventListener("contextmenu", (e) => {
						e.preventDefault();
						function getElId(el) {
							if (!el) return;
							var id = el.id;
							if (id && /^uuid-[a-f0-9]{32}/.exec(id)) {
								var match = id.replace(/^uuid-/g, "").match(/\b[a-f0-9]{32}\b/);
								if (match && match[0]) console.log(match[0], privateData[match[0]]);
								else getElId(el.parentNode);
							} else getElId(el.parentNode);
						}
						getElId(e.target);
					});

					// TEST #2: Set reference counts for each data items
					let reference = (parent, id) => {
						if (!id || id.length !== 32) return;
						if (privateData.hasOwnProperty(id)) {
							var obj = privateData[id];
							if (!obj.hasOwnProperty("parents")) obj.parents = [];
							obj.parents.push({
								id: parent,
								obj: privateData[parent]
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
					Object.keys(privateData).forEach(id => {
						var obj = privateData[id];
						if (obj.hasOwnProperty("parents")) {
							if (obj.parents.length > 1)
								multiRefs.push({ id: id, count: obj.parents.length });
						} else standalone[id]=(obj);
					});
					multiRefs.msort([{ key: "count", order: "descending" }]);
					if (multiRefs.length) {
						console.log("--- Multi-referenced objects: ");
						multiRefs.forEach((obj, order) => {
							var item = privateData[obj.id];
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
				document.querySelector("#uuid-acbdb5b00052489eae143e23982990f7").click();

				LoadingOverlay.hide(authenticated);
			} else {
				console.error(e);
				LoadingOverlay.hide(function () {
					signout("Data decryption failed!", true);
				});
			}
		} catch (e) {
			console.error(e);
			LoadingOverlay.hide(function () {
				signout("Incomplete data!", true);
			});
		}
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
		encryptJsonData: function (e) {
			if (checkSession()) {
				resetTimer();
				Renderer.clear();
				var viewer = Renderer.getDOM();

				var h2 = document.createElement("h2");
				h2.innerHTML = "Developer Tools / JSON Data Encryption";
				viewer.appendChild(h2);

				var p = document.createElement("p");
				p.innerHTML = "Convert JSON string into AES-256 encrypted data. The passphrase is used for encryption."
				viewer.appendChild(p);

				var table = document.createElement("table");
				table.setAttribute("style", "border-collapse: collapse;");
				viewer.appendChild(table);
				var tbody = document.createElement("tbody");
				table.appendChild(tbody);

				var trInputJson = document.createElement("tr");
				tbody.appendChild(trInputJson);
				var tdInputJson = document.createElement("td");
				tdInputJson.className = "center header fit-width";
				tdInputJson.innerHTML = "Input:<br />(JSON string)";
				trInputJson.appendChild(tdInputJson);
				var tdInputJsonValue = document.createElement("td");
				tdInputJsonValue.setAttribute("style", "padding: 0; font-size: 0;");
				var textarea = document.createElement("textarea");
				textarea.id = "devtools-json-encryption-input";
				textarea.setAttribute("style", "width: 100%; height: 400px; overflow-y: scroll; resize: none; border: none; box-sizing: border-box; font-size: 1rem;");
				textarea.setAttribute("wrap", "off");
				textarea.addEventListener("keydown", function (e) {
					if (e.key === "Tab") {
						e.preventDefault();
						var start = this.selectionStart;
						var end = this.selectionEnd;
						this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
						this.selectionStart = this.selectionEnd = start + 1;
					}
				});
				tdInputJsonValue.appendChild(textarea);
				trInputJson.appendChild(tdInputJsonValue);

				var trInputCryptoKey = document.createElement("tr");
				tbody.appendChild(trInputCryptoKey);
				var tdInputCryptoKey = document.createElement("td");
				tdInputCryptoKey.className = "center header fit-width";
				tdInputCryptoKey.innerHTML = "Encryption Key:";
				trInputCryptoKey.appendChild(tdInputCryptoKey);
				var tdInputCryptoKeyValue = document.createElement("td");
				tdInputCryptoKeyValue.setAttribute("style", "padding: 0; font-size: 0; background: #fff;");
				var inputKey = document.createElement("input");
				inputKey.type = "password";
				inputKey.setAttribute("style", "padding: 7px; width: 100%; font-size: 18px; line-height: 1; border: none; box-sizing: border-box;");
				inputKey.value = sessionStorage.getItem("passphrase");
				tdInputCryptoKeyValue.appendChild(inputKey);
				trInputCryptoKey.appendChild(tdInputCryptoKeyValue);

				var trCtrl = document.createElement("tr");
				tbody.appendChild(trCtrl);
				var tdCtrl = document.createElement("td");
				tdCtrl.className = "center header fit-width";
				trCtrl.appendChild(tdCtrl);
				var tdCtrlValue = document.createElement("td");
				tdCtrlValue.setAttribute("style", "padding: 5px; background: #fff;");
				trCtrl.appendChild(tdCtrlValue);

				var btnEncryption = document.createElement("button");
				btnEncryption.innerHTML = "Download Encrypted File";
				btnEncryption.addEventListener("click", function () {
					try {
						var textarea = document.querySelector("#devtools-json-encryption-input");
						var parsed = JSON.parse(textarea.value);
						var minified = JSON.stringify(parsed);
						var encrypted = CryptoJS.AES.encrypt(minified, inputKey.value).toString();
						var blob = new Blob([encrypted], { type: "text/plain; charset=utf-8" });
						var blobUrl = URL.createObjectURL(blob);
						var a = document.createElement("a");
						a.href = blobUrl;
						a.download = "data.txt";
						a.click();
						URL.revokeObjectURL(blobUrl);
					} catch (e) {
						alert(e);
					}
				});
				tdCtrlValue.appendChild(btnEncryption);

				var btnReset = document.createElement("button");
				btnReset.innerHTML = "Reset";
				btnReset.addEventListener("click", function () {
					document.querySelector("#devtools-json-encryption-input").value = "";
					document.querySelector("#devtools-json-encryption-input").focus();
				});
				tdCtrlValue.appendChild(btnReset);

				document.querySelector("#devtools-json-encryption-input").focus();
			} else {
				signout("Session is expired.");
			}
		},
		encryptFile: function () {
			if (checkSession()) {
				resetTimer();
				Renderer.clear();
				var viewer = Renderer.getDOM();

				var h2 = document.createElement("h2");
				h2.innerHTML = "Developer Tools / File Encryption";
				viewer.appendChild(h2);

				var p = document.createElement("p");
				p.innerHTML = "Encrypt the content of the given file. The passphrase is used for encryption."
				viewer.appendChild(p);

				var table = document.createElement("table");
				table.setAttribute("style", "border-collapse: collapse;");
				viewer.appendChild(table);
				var tbody = document.createElement("tbody");
				table.appendChild(tbody);

				var trInput = document.createElement("tr");
				tbody.appendChild(trInput);
				var tdInput = document.createElement("td");
				tdInput.className = "center header fit-width";
				tdInput.innerHTML = "Input:";
				trInput.appendChild(tdInput);
				var tdInputValue = document.createElement("td");
				tdInputValue.setAttribute("style", "padding: 5px; background: #fff;");
				trInput.appendChild(tdInputValue);
				var label = document.createElement("label");
				label.id = "devtools-file-encryption-input-label";
				label.setAttribute("for", "devtools-file-encryption-input");
				label.innerHTML = "Select a file...";
				tdInputValue.appendChild(label);
				var input = document.createElement("input");
				input.id = "devtools-file-encryption-input";
				input.type = "file";
				input.setAttribute("style", "display: none;");
				input.addEventListener("change", function (e) {
					if (e.target.files.length) {
						var file = e.target.files[0];
						document.querySelector("#devtools-file-encryption-input-label").innerHTML = file.name;
						this.nextSibling.innerHTML = "(" + file.type + ")";
					} else {
						document.querySelector("#devtools-file-encryption-input-label").innerHTML = "Select a file...";
						this.nextSibling.innerHTML = "";
					}
				});
				tdInputValue.appendChild(input);
				var span = document.createElement("span");
				span.id = "devtools-file-encryption-input-type";
				span.setAttribute("style", "margin-left: 5px; font-size: .85rem;");
				tdInputValue.appendChild(span);

				var trInputCryptoKey = document.createElement("tr");
				tbody.appendChild(trInputCryptoKey);
				var tdInputCryptoKey = document.createElement("td");
				tdInputCryptoKey.className = "center header fit-width";
				tdInputCryptoKey.innerHTML = "Encryption Key:";
				trInputCryptoKey.appendChild(tdInputCryptoKey);
				var tdInputCryptoKeyValue = document.createElement("td");
				tdInputCryptoKeyValue.setAttribute("style", "padding: 0; font-size: 0; background: #fff;");
				var inputKey = document.createElement("input");
				inputKey.type = "password";
				inputKey.setAttribute("style", "padding: 7px; width: 100%; font-size: 18px; line-height: 1; border: none; box-sizing: border-box;");
				inputKey.value = sessionStorage.getItem("passphrase");
				tdInputCryptoKeyValue.appendChild(inputKey);
				trInputCryptoKey.appendChild(tdInputCryptoKeyValue);

				var trCtrl = document.createElement("tr");
				tbody.appendChild(trCtrl);
				var tdCtrl = document.createElement("td");
				tdCtrl.className = "center header fit-width";
				trCtrl.appendChild(tdCtrl);
				var tdCtrlValue = document.createElement("td");
				tdCtrlValue.setAttribute("style", "padding: 5px; background: #fff;");
				trCtrl.appendChild(tdCtrlValue);

				var btnDownload = document.createElement("button");
				btnDownload.innerHTML = "Download Encrypted File";
				btnDownload.addEventListener("click", function () {
					var input = document.querySelector("#devtools-file-encryption-input");
					if (!input.files.length) return;
					const encrypt = file => new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => {
							// var ui8a = new Uint8Array(reader.result);
							var wordArray = CryptoJS.lib.WordArray.create(reader.result);
							var encrypted = CryptoJS.AES.encrypt(wordArray, inputKey.value).toString();
							resolve(encrypted);
						}
						reader.onerror = e => reject(e);
						reader.readAsArrayBuffer(file);
					});
					async function download() {
						var input = document.querySelector("#devtools-file-encryption-input");
						var file = input.files[0];
						const result = await encrypt(file).catch(e => Error(e));
						if (result instanceof Error) alert(result.message);

						var fname = CryptoJS.SHA256(result).toString();
						var fext = file.name.split(".").length > 1 ? "." + file.name.split(".").pop() : "";

						var blob = new Blob([result], { type: "text/plain; charset=utf-8" });
						var blobUrl = URL.createObjectURL(blob);
						var a = document.createElement("a");
						a.href = blobUrl;
						a.download = fname + fext;
						a.click();
						URL.revokeObjectURL(blobUrl);
					}
					download();
				});
				tdCtrlValue.appendChild(btnDownload);

				var btnReset = document.createElement("button");
				btnReset.innerHTML = "Reset";
				btnReset.addEventListener("click", function () {
					document.querySelector("#devtools-file-encryption-input").value = "";
					document.querySelector("#devtools-file-encryption-input-label").innerHTML = "Select a file...";
					document.querySelector("#devtools-file-encryption-input-type").innerHTML = "";
				});
				tdCtrlValue.appendChild(btnReset);
			} else {
				signout("Session is expired.");
			}
		},
		generateDataUrl: function () {
			if (checkSession()) {
				resetTimer();
				Renderer.clear();
				var viewer = Renderer.getDOM();

				var h2 = document.createElement("h2");
				h2.innerHTML = "Developer Tools / Generate Data URL";
				viewer.appendChild(h2);

				var p = document.createElement("p");
				p.innerHTML = "Generate data URL.";
				viewer.appendChild(p);

				var table = document.createElement("table");
				table.setAttribute("style", "border-collapse: collapse;");
				viewer.appendChild(table);
				var tbody = document.createElement("tbody");
				table.appendChild(tbody);

				var trInput = document.createElement("tr");
				tbody.appendChild(trInput);
				var tdInput = document.createElement("td");
				tdInput.className = "center header fit-width";
				tdInput.innerHTML = "Input:";
				trInput.appendChild(tdInput);
				var tdInputValue = document.createElement("td");
				tdInputValue.setAttribute("style", "padding: 5px; background: #fff;");
				trInput.appendChild(tdInputValue);
				var label = document.createElement("label");
				label.id = "devtools-dataurl-generation-input-label";
				label.setAttribute("for", "devtools-dataurl-generation-input");
				label.innerHTML = "Select a file...";
				tdInputValue.appendChild(label);
				var input = document.createElement("input");
				input.id = "devtools-dataurl-generation-input";
				input.type = "file";
				input.setAttribute("style", "display: none;");
				input.addEventListener("change", function (e) {
					if (e.target.files.length) {
						var file = e.target.files[0];
						document.querySelector("#devtools-dataurl-generation-input-label").innerHTML = file.name;
						if (file.type) this.nextSibling.innerHTML = "(" + file.type + ")";
					} else {
						document.querySelector("#devtools-dataurl-generation-input-label").innerHTML = "Select a file...";
						this.nextSibling.innerHTML = "";
					}
				});
				tdInputValue.appendChild(input);
				var span = document.createElement("span");
				span.id = "devtools-dataurl-generation-input-type";
				span.setAttribute("style", "margin-left: 5px; font-size: .85rem;");
				tdInputValue.appendChild(span);

				var trOutput = document.createElement("tr");
				tbody.appendChild(trOutput);
				var tdOutput = document.createElement("td");
				tdOutput.className = "center header fit-width";
				tdOutput.innerHTML = "Output:<br />(Base64)";
				trOutput.appendChild(tdOutput);
				var tdOutputValue = document.createElement("td");
				tdOutputValue.setAttribute("style", "padding: 0; font-size: 0; background: #fff;");
				var textarea = document.createElement("textarea");
				textarea.id = "devtools-dataurl-generation-output";
				textarea.setAttribute("style", "width: 100%; height: 400px; overflow-y: scroll; resize: none; border: none; box-sizing: border-box; font-size: 1rem;");
				textarea.setAttribute("disabled", "");
				tdOutputValue.appendChild(textarea);
				trOutput.appendChild(tdOutputValue);

				var trCtrl = document.createElement("tr");
				tbody.appendChild(trCtrl);
				var tdCtrl = document.createElement("td");
				tdCtrl.className = "center header fit-width";
				tdCtrl.innerHTML = "";
				trCtrl.appendChild(tdCtrl);
				var tdCtrlValue = document.createElement("td");
				tdCtrlValue.setAttribute("style", "padding: 5px; background: #fff;");
				trCtrl.appendChild(tdCtrlValue);

				var btnView = document.createElement("button");
				btnView.innerHTML = "View DataURL";
				btnView.addEventListener("click", function () {
					var input = document.querySelector("#devtools-dataurl-generation-input");
					if (!input.files.length) return;
					const toBase64 = file => new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.readAsDataURL(file);
						reader.onload = () => resolve(reader.result);
						reader.onerror = error => reject(error);
					});
					async function viewData() {
						var input = document.querySelector("#devtools-dataurl-generation-input");
						var file = input.files[0];
						const result = await toBase64(file).catch(e => Error(e));
						if (result instanceof Error) alert(result.message);
						document.querySelector("#devtools-dataurl-generation-output").value = result;
					}
					viewData();
				});
				tdCtrlValue.appendChild(btnView);

				var btnDownload = document.createElement("button");
				btnDownload.innerHTML = "Download DataURL as File";
				btnDownload.addEventListener("click", function () {
					var input = document.querySelector("#devtools-dataurl-generation-input");
					if (!input.files.length) return;
					const toBase64 = file => new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.readAsDataURL(file);
						reader.onload = () => resolve(reader.result);
						reader.onerror = error => reject(error);
					});
					async function download() {
						var input = document.querySelector("#devtools-dataurl-generation-input");
						var file = input.files[0];
						console.log(file);
						const result = await toBase64(file).catch(e => Error(e));
						if (result instanceof Error) alert(result.message);

						var blob = new Blob([result], { type: "text/plain; charset=utf-8" });
						var blobUrl = URL.createObjectURL(blob);
						var a = document.createElement("a");
						a.href = blobUrl;
						a.download = file.name.replace(/\.[^.]+$/, ".txt");
						a.click();
						URL.revokeObjectURL(blobUrl);
					}
					download();
				});
				tdCtrlValue.appendChild(btnDownload);

				var btnReset = document.createElement("button");
				btnReset.innerHTML = "Reset";
				btnReset.addEventListener("click", function () {
					document.querySelector("#devtools-dataurl-generation-input").value = "";
					document.querySelector("#devtools-dataurl-generation-input-label").innerHTML = "Select a file...";
					document.querySelector("#devtools-dataurl-generation-input-type").innerHTML = "";
					document.querySelector("#devtools-dataurl-generation-output").value = "";
				});
				tdCtrlValue.appendChild(btnReset);
			} else {
				signout("Session is expired.");
			}
		},
		generateUUID: function () {
			if (DEBUG) {
				function uuidv4() {
					return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
						(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
					);
				}
				var uuid = uuidv4();
				navigator.clipboard.writeText(uuid.replace(/-/g, '')).then(function () {
					// Do nothing
				}, function (err) {
					console.error("Could not copy text: ", err);
				});
				return;
			}

			if (checkSession()) {
				resetTimer();
				Renderer.clear();
				var viewer = Renderer.getDOM();

				var h2 = document.createElement("h2");
				h2.innerHTML = "Developer Tools / Generate UUIDv4";
				viewer.appendChild(h2);

				var table = document.createElement("table");
				table.setAttribute("style", "border-collapse: collapse;");
				viewer.appendChild(table);
				var tbody = document.createElement("tbody");
				table.appendChild(tbody);

				var trOutput = document.createElement("tr");
				tbody.appendChild(trOutput);
				var tdOutput = document.createElement("td");
				tdOutput.className = "center header fit-width";
				tdOutput.innerHTML = "UUIDv4:";
				trOutput.appendChild(tdOutput);
				var tdOutputValue = document.createElement("td");
				tdOutputValue.setAttribute("style", "padding: 0; font-size: 0; background: #fff;");
				var input = document.createElement("input");
				input.id = "devtools-generate-uuid-output";
				input.setAttribute("style", "padding: 7px; width: 100%; font-family: consolas; font-size: 1rem; line-height: 1; border: none; box-sizing: border-box;");
				input.setAttribute("readonly", "");
				input.addEventListener("focus", function (e) {
					this.setSelectionRange(0, this.value.length);
				});
				tdOutputValue.appendChild(input);
				trOutput.appendChild(tdOutputValue);

				var trCtrl = document.createElement("tr");
				tbody.appendChild(trCtrl);
				var tdCtrl = document.createElement("td");
				tdCtrl.className = "center header fit-width";
				tdCtrl.innerHTML = "";
				trCtrl.appendChild(tdCtrl);
				var tdCtrlValue = document.createElement("td");
				tdCtrlValue.setAttribute("style", "padding: 5px; background: #fff;");
				trCtrl.appendChild(tdCtrlValue);

				var btnGenerateUuidV4 = document.createElement("button");
				btnGenerateUuidV4.innerHTML = "Generate";
				btnGenerateUuidV4.addEventListener("click", function () {
					var output = document.querySelector("#devtools-generate-uuid-output");
					function uuidv4() {
						return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
							(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
						);
					}
					var uuid = uuidv4();
					output.value = uuid;
					navigator.clipboard.writeText(uuid.replace(/-/g, '')).then(function () {
						// Do nothing
					}, function (err) {
						console.error("Could not copy text: ", err);
					});
				});
				tdCtrlValue.appendChild(btnGenerateUuidV4);

				var btnReset = document.createElement("button");
				btnReset.innerHTML = "Reset";
				btnReset.addEventListener("click", function () {
					document.querySelector("#devtools-generate-uuid-output").value = "";
				});
				tdCtrlValue.appendChild(btnReset);
			} else {
				signout("Session is expired.");
			}
		},
		exportData: function () {
			var original = JSON.parse(JSON.stringify(privateData))
			for (const [key, obj] of Object.entries(original)) delete obj["parents"];
			var blob = new Blob([JSON.stringify(original, null, 4)], { type: "	application/json" });
			var a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = "data.json";
			a.click();
		}
	};
})();
