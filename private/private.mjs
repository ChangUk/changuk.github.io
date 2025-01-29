import { ShortUuidV4 } from "/assets/lib/short-uuidv4/1.0.1/short-uuidv4.js";
import renderMathInElement from "/assets/lib/katex/0.12.0/contrib/auto-render.mjs";
import { Entity } from "/assets/lib/sectional/1.0.0/entity.js";
import { Sectional } from "/assets/lib/sectional/1.0.0/sectional.js";
import { Remarkable } from "/assets/lib/remarkable/2.0.0/remarkable.js";
import { default as CryptoES } from "/assets/lib/crypto-es/1.2.6/index.js";
import { ShakeElement } from "/assets/util.mjs";

const DEBUG = false;

const AUTH_MESSAGE = "U2FsdGVkX19BSw9elWK2K5nKVbmFScJVxM6QpumRDhRy1ZBOdJoVJjMC7B4Y+g2/";

const SESSION_TIME = (DEBUG ? 60 : 10) * 60 * 1000;

let timer = null;
let timerDisplay = null;
function resetTimer() {
	if (timer) clearTimeout(timer);
	timer = setTimeout(function () {
		signout("Session expired!", true);
	}, SESSION_TIME);

	if (timerDisplay) clearTimeout(timerDisplay);
	let remaining = ~~(SESSION_TIME / 1000);
	function displayTimer() {
		timerDisplay = setTimeout(displayTimer, 1000);
		let min = String("00" + ~~(remaining / 60)).slice(-2);
		let sec = String("00" + ~~(remaining % 60)).slice(-2);
		timeDisplayer.innerHTML = `${min}:${sec}`;
		remaining -= 1;
	}
	displayTimer();

	sessionStorage.setItem("expire", Date.now() + SESSION_TIME);
}

let uuidv4 = (quotation = false) => {
	let newUuid = new ShortUuidV4().new();
	return quotation ? `"${newUuid}"` : newUuid;
};

class LoadingOverlay {
	constructor(el) {
		if (!el) throw new Error(`Invalid element: ${el}`);
		this.display = false;
		this.el = el;
		this.el.style.setProperty("display", "none");
	}
	show() {
		if (this.display) return;

		// Display overlay with reflow
		let newEl = this.el.cloneNode(true);
		this.el.parentNode.replaceChild(newEl, this.el);
		newEl.style.removeProperty("display");
		this.el = newEl;

		this.display = true;
		this.timer = setInterval(() => {
			if (!this.display) {
				this.el.style.setProperty("display", "none");
				if (this.callback) this.callback();
				clearInterval(this.timer);
			}
		}, 1000);
	}
	hide(callback) {
		if (this.display) {
			if (callback) this.callback = callback;
			this.display = false;
		}
	}
}



// Initialize element variables
const entryWrapper = document.querySelector("#private-forbidden");
const inputPassphrase = document.querySelector("#input-passphrase");
const aside = document.querySelector("aside");

const privateWrapper = document.querySelector("#private-wrapper");
const privateMenu = document.querySelector("#private-menu");
const contentWrapper = document.querySelector("#private-content");
const timeDisplayer = document.querySelector("#session-timer");

let overlay = null;
let sectional = null;

// Check element variables
if (!entryWrapper || !inputPassphrase || !privateWrapper) {
	throw new Error("Invalid element variable!");
}

// Loading overlay
overlay = new LoadingOverlay(document.querySelector("#overlay-loading"));

if (inputPassphrase) {
	inputPassphrase.addEventListener("keypress", (e) => {
		e.stopPropagation();
	});
	inputPassphrase.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			entryWrapper.classList.add("hidden");
			auth(e.target.value);
			e.target.value = "";
		} else if (e.key === "Escape") {
			e.target.value = "";
		}
	});

	// Auto focus on passphrase
	inputPassphrase.focus();
}

if (timeDisplayer) timeDisplayer.addEventListener("click", resetTimer);

// Session test
if (window.sessionStorage && checkSession()) {
	// If passphrase exists, authentication is automatically performed.
	let passphrase = sessionStorage.getItem("passphrase");
	if (passphrase) auth(passphrase);
} else signout();

document.onmousedown = (e) => {
	collapseAllDropdowns();
	deselectMenuItems();
};



function auth(passphrase) {
	overlay.show();

	try {
		let result = CryptoES.AES.decrypt(AUTH_MESSAGE, passphrase).toString(CryptoES.enc.Utf8);
		if (result) {
			sessionStorage.setItem("passphrase", passphrase);

			// Set timer
			resetTimer();

			// Load private data
			//fetch(DEBUG ? "/private/data.json" : "/private/data.txt").then(response => {
			fetch("/private/data.txt").then(response => {
				if (response.ok) return response.text();
				return {};
			}).then(data => {
				try {
					//let decrypted = DEBUG ? data : CryptoES.AES.decrypt(data, passphrase).toString(CryptoES.enc.Utf8);
					let decrypted = CryptoES.AES.decrypt(data, passphrase).toString(CryptoES.enc.Utf8);
					if (decrypted) {
						return JSON.parse(decrypted);
					} else {
						overlay.hide(() => {
							signout("Data decryption failed!", true);
						});
					}
				} catch (e) {
					overlay.hide(() => {
						signout("Incomplete data!", true);
					});
					console.error(e);
				}
			}).then(json => {
				loadData(json);
				openManager();
			}).catch(e => {
				console.error(e);
			});
		} else {
			overlay.hide(() => {
				signout("Incorrect passphrase!", true);
			});
			return false;
		}
	} catch (e) {
		console.error(e);
		overlay.hide(() => {
			signout("Unknown error is occurred!", true);
		});
		return false;
	}
}

function resetViewport() {
	while (contentWrapper.lastChild) contentWrapper.removeChild(contentWrapper.lastChild);
	while (privateMenu.lastChild) privateMenu.removeChild(privateMenu.lastChild);
}

export function signout(msg, shake = false) {
	if (timer) clearTimeout(timer);

	sessionStorage.removeItem("passphrase");
	sessionStorage.removeItem("expire");

	resetViewport();

	entryWrapper.classList.remove("hidden");
	if (inputPassphrase) inputPassphrase.focus();
	privateWrapper.classList.add("hidden");
	aside.classList.add("hidden");

	let el = document.querySelector("#auth-message");
	if (msg && typeof msg === "string") {
		el.innerHTML = msg;
		if (shake) ShakeElement(el, 30, 3);
	} else el.innerHTML = "";
}
function authenticated() {
	entryWrapper.classList.add("hidden");
	privateWrapper.classList.remove("hidden");
}
export function checkSession() {
	try {
		let expire = parseInt(sessionStorage.getItem("expire"));
		return sessionStorage.getItem("passphrase") && Date.now() < expire;
	} catch {
		return false;
	}
}

const ArticleHierarchy = {
	"root": {
		children: ["7ulAuUNKXvMPStr5o16gbh", "6FxlCPMSwO8JrVaWKxXSuW"],
		type: "root"
	},
	"7ulAuUNKXvMPStr5o16gbh": {			// Leftside menu wrapper
		children: [
			"5fXnqmbl53aqjA7bUoFcdF",
			"2aHDmHiBxvL61esf4XSeP4",
			"54YHN4WgJsduHa3uz9UGDQ",
			"7jjwXfdTcmO8GozkinOwRb"
		],
		type: "wrapper"
	},
	"2aHDmHiBxvL61esf4XSeP4": {
		children: [
			"2atx4ItGLmpZf9EJrOKWGu",
			null,
			"7g4rwjwvoRjhsD5449dLE2",
			"3qMOJlgiEYVdWhaVBTFny0",
			null,
			"5l5dIUixLJTgPMSpfs2Nw9",
			"60K0Y43NXJvNTGvicyT5rE"
		],
		title: "Assets",
		type: "dropdown"
	},
	"7jjwXfdTcmO8GozkinOwRb": {
		children: ["5ddOhGG7pY0eMAbxYDAsZB", "5cucBWYnWmSea0qjAQFeeJ"],
		title: "Largesse Ledger",
		type: "dropdown"
	},
	"6FxlCPMSwO8JrVaWKxXSuW": {
		children: ["2H4V5yUg7DMUDTw75QHyyw"],
		type: "wrapper"
	},
	"2H4V5yUg7DMUDTw75QHyyw": {
		action: "signout",
		title: "Sign Out",
		type: "action"
	}
};
let currentArticle = "";

function loadData(data) {
	if (!data) return;

	sectional = new Sectional(contentWrapper, data, {
		insertSections: false,
		callback: (el, ...params) => {
			if (el.tagName === "PRE") {
				el.classList.add("hljs");
				el.querySelectorAll("code").forEach(function (code) {
					if (code.classList.length) {
						const worker = new Worker("/assets/lib/highlight/10.7.2/worker.js");
						worker.onmessage = (e) => { code.innerHTML = e.data; }
						worker.postMessage(code.textContent);
					}
				});
			} else {
				// Translate markdown syntax
				let markdown = new Remarkable("commonmark", {});
				el.innerHTML = markdown.render(el.innerHTML);
				if (el.children.length === 1) {
					// In genenral, texts are transformed into <p> element.
					el.innerHTML = el.innerHTML.replace(/^(\s*<p>)|(<\/p>\s*)$/g, "");
				} else if (el.children.length > 1) {
					let div = document.createElement("div");
					div.innerHTML = el.innerHTML;
					el.innerHTML = "";
					el.appendChild(div);
				}

				// Render math equations
				renderMathInElement(el, {
					throwOnError: false,
					delimiters: [
						{ left: "$$", right: "$$", display: true },
						{ left: "$", right: "$", display: false },
						{ left: "\\(", right: "\\)", display: false },
						{ left: "\\[", right: "\\]", display: true }
					]
				});
			}
		},
		entry: "0000000000000000000000"
	});

	// Reset viewport
	resetViewport();

	// Render contents
	let root = ArticleHierarchy["root"];
	root.children.forEach((menuWrapperId) => {
		if (!menuWrapperId) return;

		let ul = document.createElement("ul");
		ul.id = `stnl-${menuWrapperId}`;
		privateMenu.appendChild(ul);

		let menuWrapper = ArticleHierarchy[menuWrapperId];
		menuWrapper.children.forEach((id) => {
			let entity = (id in ArticleHierarchy) ? ArticleHierarchy[id] : sectional.getEntity(id);
			if (!entity) return;

			let li = document.createElement("li");
			li.id = `stnl-${id}`;
			li.innerHTML = entity.title;
			li.addEventListener("mousedown", (e) => {
				if (e.button !== 0) {
					e.preventDefault();
					return;
				}
				collapseAllDropdowns();
				if (!e.target.classList.contains("selected")) {
					let dropdown = e.target.querySelector(".dropdown");
					if (dropdown) {
						e.target.classList.add("selected");
						dropdown.classList.remove("hidden");
					}
				}
				deselectMenuItems();
				e.stopPropagation();
			});

			if (entity.type === "article") {
				li.addEventListener("click", e => article(e.target.id.replace(/^stnl-/g, "")));
			} else if (entity.type === "action") {
				li.addEventListener("click", e => action(id));
			} else if (entity.type === "dropdown") {
				// Add caret
				li.classList.add("has-dropdown");

				// Create dropdown
				let dropdownEl = document.createElement("ul");
				dropdownEl.classList.add("dropdown", "rightward", "hidden");
				li.appendChild(dropdownEl);

				// Disable mouse click event over empty spaces
				dropdownEl.addEventListener("mousedown", (e) => {
					e.stopPropagation();
				});

				// Add dropdown sub-items
				if (entity.children && entity.children.length) {
					entity.children.forEach(childId => dropdown(childId, dropdownEl));
				}
			}
			ul.appendChild(li);
		});
	});

	let voidDiv = document.createElement("div");
	voidDiv.className = "void";
	privateMenu.insertBefore(voidDiv, privateMenu.lastChild);

	// Open main page
	overlay.hide(authenticated);
	document.querySelector("#stnl-5fXnqmbl53aqjA7bUoFcdF").click();
}

function article(id) {
	if (checkSession()) {
		resetTimer();
		if (sectional) {
			sectional.clearViewport();
			sectional.article(id, false);
			currentArticle = id;
		}
	} else {
		signout("Session expired!");
	}
}

function dropdown(id, parentEl) {
	let li = document.createElement("li");
	if (id) {
		let entity = (id in ArticleHierarchy) ? ArticleHierarchy[id] : sectional.getEntity(id);
		if (!entity) return;

		li.id = `stnl-${id}`;
		li.innerHTML = entity.title;
		li.addEventListener("mousedown", e => e.stopPropagation());
		li.addEventListener("click", (e) => {
			collapseAllDropdowns();
			deselectMenuItems();
		});
		if (entity.type === "article") {
			li.addEventListener("click", e => article(id));
		} else if (entity.type === "action") {
			li.addEventListener("click", e => action(id));
		}
	} else {
		li.className = "separator";
	}
	parentEl.appendChild(li);
}

function action(id) {
	let entity = (id in ArticleHierarchy) ? ArticleHierarchy[id] : sectional.getEntity(id);
	if (!entity) return;

	if (checkSession()) {
		resetTimer();
		if (entity.action === "exportData") exportData();
		else if (entity.action === "signout") signout();
	} else {
		signout("Session expired!");
	}
}

function openManager() {
	aside.classList.remove("hidden");

	const entityTypes = document.querySelector("#id-00q3kS1yS9sr0REdzzkDlw");
	while (entityTypes.lastChild) entityTypes.removeChild(entityTypes.lastChild);
	Object.keys(Entity.TEMPLATE).sort().forEach((entityType) => {
		let option = document.createElement("option");
		option.value = entityType;
		entityTypes.appendChild(option);
	});

	document.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		function getElId(el) {
			if (!el) return;
			let id = el.id;
			if (id && /^stnl-[a-zA-Z0-9]{22}/.exec(id)) {
				let match = id.replace(/^stnl-/g, "").match(/\b[a-zA-Z0-9]{22}\b/);
				if (match && match[0]) {
					const entityId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
					entityId.value = match[0];
					entityId.dispatchEvent(new Event("change"));

					const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
					entityContent.scrollTop = 0;
					entityContent.scrollLeft = 0;
				}
				else getElId(el.parentNode);
			} else getElId(el.parentNode);
		}
		getElId(e.target);
		resetTimer();
	});

	{ // Export
		const btnInspect = document.querySelector("#id-1NAFGkLR4TXDd24jmOS6NH");
		btnInspect.addEventListener("click", e => {
			inspectData();
		});
		const btnExport = document.querySelector("#id-3rTZdFdxjcWXsrIpFFkaTj");
		btnExport.addEventListener("click", e => {
			let result = confirm("Are you sure to export private data?");
			if (result) exportData();
		});
	}
	{ // Entity Editor
		const checkIdFormat = (value) => {
			const input = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
			if (/^[a-zA-Z0-9]{22}$/.exec(value) || !value.length) {
				input.classList.remove("invalid-value");
				return true;
			} else {
				input.classList.add("invalid-value");
				return false;
			}
		}
		const checkEntityContent = (value) => {
			const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
			if (!value.length) {
				entityContent.classList.remove("invalid-value");
				return true;
			}
			try {
				JSON.parse(value);
				entityContent.classList.remove("invalid-value");
				return true;
			} catch (err) {
				entityContent.classList.add("invalid-value");
				return false;
			}
		}

		const entityId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
		entityId.addEventListener("keydown", (e) => {
			e.stopPropagation();
			if (e.key === "Escape") { e.target.value = ""; }
		});
		entityId.addEventListener("keypress", (e) => {
			// Prevent from auto focusing on search input
			e.stopPropagation();
		});
		entityId.addEventListener("focus", (e) => {
			e.target.select();
		});
		entityId.addEventListener("input", (e) => {
			checkIdFormat(e.target.value);
		});
		entityId.addEventListener("change", (e) => {
			checkIdFormat(e.target.value);
			const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
			let entity = sectional.getEntity(e.target.value);
			if (entity && e.target.value.length === 22) {
				const ordered = Object.keys(entity).sort().reduce(
					(obj, key) => {
						obj[key] = entity[key];
						return obj;
					},
					{}
				);
				entityContent.value = JSON.stringify(ordered, null, 4);
			} else entityContent.value = "";
			entityContent.dispatchEvent(new Event("change"));
		});

		const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
		entityContent.addEventListener("keydown", (e) => {
			e.stopPropagation();
		});
		entityContent.addEventListener("keypress", (e) => {
			e.stopPropagation();
		});
		entityContent.addEventListener("input", (e) => {
			e.stopPropagation();
		});
		entityContent.addEventListener("change", (e) => {
			checkEntityContent(e.target.value);
		});

		const btnReset = document.querySelector("#id-3F5CVe3tnFadXKSNxNDJYA");
		btnReset.addEventListener("click", (e) => {
			const entityId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
			entityId.value = "";
			entityId.dispatchEvent(new Event("change"));
		});

		const btnNewId = document.querySelector("#id-0W4rZ284okFhNi3wEwsRdO");
		btnNewId.addEventListener("click", e => {
			const entityId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
			entityId.value = uuidv4();
			const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
			entityContent.value = entityContent.value.replace(/(\"_id\"\s*:\s*\").*\"/, `$1${entityId.value}"`);
		});

		const btnSave = document.querySelector("#id-2QEfF3VjOq5mStkqEMaFRO");
		btnSave.addEventListener("click", (e) => {
			const entityId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
			if (!checkIdFormat(entityId.value)) {
				alert("Invalid Entity ID format!");
				return;
			}
			const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
			const checkBox = document.querySelector("#id-6SPsMZVMeMkxjleU85vY0X");
			if (!checkEntityContent(entityContent.value)) {
				alert("Invalid JSON format!");
				return;
			}
			if (entityId.value.length && entityContent.value.length) {
				let res = false;
				if (sectional.getEntity(entityId.value)) res = confirm("The given entity ID is existing.\nAre you sure to overwrite?");
				else res = confirm("Are you sure to save entity?");
				if (res) {
					try {
						let entity = JSON.parse(entityContent.value);
						if (checkBox.checked && entity.hasOwnProperty("_parents")) {
							entity._parents.forEach(parentId => {
								let parentEntity = sectional.getEntity(parentId);
								if (parentEntity && parentEntity.hasOwnProperty("children")) {
									if (!parentEntity.children.includes(entityId.value))
										parentEntity.children.push(entityId.value);
									sectional.setEntity(parentId, parentEntity);
								}
							});
						}
						let result = sectional.setEntity(entityId.value, entity);
						if (result) {
							alert("Successfully saved!");
							if (currentArticle) sectional.article(currentArticle);
						} else {
							alert("Failed to save entity!");
						}
					} catch (err) {
						alert(`Failed to save entity: ${err}`);
					}
				}
			}
		});

		const btnRemove = document.querySelector("#id-1Q5TS3PdxDME4YF92Rayl0");
		btnRemove.addEventListener("click", (e) => {
			const curId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
			if (!checkIdFormat(curId.value)) {
				alert("Invalid Entity ID format!");
				return;
			}
			return;
			if (curId.value.length) {
				if (sectional.getEntity(curId.value)) {
					if (confirm("Are you sure to delete entity?")) {
						let result = sectional.removeEntity(curId.value);
						if (result) alert("Successfully removed!");
						else alert("Failed to remove entity!");
					}
				} else {
					alert("Not found the given entity ID!");
					return;
				}
			}
		});
	}
	{ // Entity Template
		const combobox = document.querySelector("#id-6kYDDAzRbke7m1Rb1Rvqkp");
		combobox.addEventListener("keydown", (e) => {
			e.stopPropagation();
			if (e.key === "Escape") {
				e.target.value = "";
				// e.target.dispatchEvent(new Event("input"));
			}
		});
		combobox.addEventListener("keypress", (e) => {
			// Prevent from auto focusing on search input
			e.stopPropagation();
		});
		combobox.addEventListener("input", (e) => {
			e.stopPropagation();
		});
		combobox.addEventListener("change", (e) => {
			if (!e.target.value) return;
			const textarea = document.querySelector("#id-1Stir8sO6QnPpV8xcyimeG");
			let template = Entity.Template(e.target.value);
			const ordered = Object.keys(template).sort().reduce(
				(obj, key) => {
					obj[key] = template[key];
					return obj;
				},
				{}
			);
			textarea.value = JSON.stringify(ordered, null, 4);
		});

		const btnReset = document.querySelector("#id-3597Oai8C2I4bKXVQShv50");
		btnReset.addEventListener("click", (e) => {
			const combobox = document.querySelector("#id-6kYDDAzRbke7m1Rb1Rvqkp");
			combobox.value = "";
			combobox.dispatchEvent(new Event("change"));
			const template = document.querySelector("#id-1Stir8sO6QnPpV8xcyimeG");
			template.value = "";
		});

		const btnCopyTemplate = document.querySelector("#id-5sBvAZMWtngtuHx0SPEwKM");
		btnCopyTemplate.addEventListener("click", (e) => {
			const template = document.querySelector("#id-1Stir8sO6QnPpV8xcyimeG");
			navigator.clipboard.writeText(template.value).then(() => {
				// Do nothing
			}, (e) => {
				console.error("Could not copy text: ", e);
			});
		});
	}
}

function exportData() {
	let deepCopied = JSON.parse(JSON.stringify(sectional.getData()));
	for (const [id, entity] of Object.entries(deepCopied)) {
		for (const key of Object.keys(entity)) {
			if (key.startsWith('_')) delete entity[key];
		}
	}
	let blob = new Blob([JSON.stringify(deepCopied)], { type: "application/json" });
	let a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = "data.json";
	a.click();
}

function inspectData() {
	// TEST #1: Set reference counts for each data items
	let reference = (parent, id) => {
		if (!id || id.length !== 22) return;
		let entity = sectional.getEntity(id);
		if (entity) {
			// Necessary properties
			if (entity.hasOwnProperty("children"))
				entity.children.forEach(childId => { reference(id, childId); });
			if (entity.hasOwnProperty("content") && typeof entity.content === "object")
				Object.keys(entity.content).forEach((key) => { reference(id, entity.content[key]); });

			// Optional properties
			if (entity.hasOwnProperty("classlist"))
				reference(id, entity.classlist);
			if (entity.hasOwnProperty("properties"))
				reference(id, entity.properties);
			if (entity.hasOwnProperty("action"))
				reference(id, entity.action);
		} else console.log(`--- Broken pointer: parent("${parent}") -> target("${id}")"`);
	}
	reference(null, sectional.getEntry());

	// TEST #2: Check if invalid data exists and get parent object
	let multiRefs = [];
	let standalone = {};
	let entityIDs = Object.keys(sectional.getData());
	entityIDs.forEach(id => {
		let entity = sectional.getEntity(id);
		if (entity.hasOwnProperty("_parents")) {
			if (entity._parents.length > 1)
				multiRefs.push({ id: id, refCount: entity._parents.length });
		} else standalone[id] = entity;
	});
	multiRefs.msort([{ key: "refCount", order: "descending" }]);

	if (multiRefs.length) {
		console.log("--- Multi-referenced entities: ");
		multiRefs.forEach((obj, order) => {
			let entity = sectional.getEntity(obj.id);
			if (entity.type !== "action" && entity.type !== "properties" && entity.type !== "classlist")
				console.log(`"${obj.id}"`, entity);
		});
	}
	if (Object.keys(standalone).length) {
		console.log("--- Standalone entities: ");
		for (const [id, obj] of Object.entries(standalone))
			console.log(`"${id}"`, obj);
	}
}

function collapseAllDropdowns() {
	Array.from(document.querySelectorAll(".dropdown")).forEach(function (dropdown) {
		dropdown.classList.add("hidden");
	});
}
function deselectMenuItems() {
	Array.from(document.querySelectorAll("#private-menu > ul")).forEach(function (ul) {
		Array.from(ul.children).forEach(function (menuItem) {
			menuItem.classList.remove("selected");
		});
	});
}
