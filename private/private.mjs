import { ShortUuidV4 } from "/assets/lib/short-uuidv4/1.0.1/short-uuidv4.js";
import renderMathInElement from "/assets/lib/katex/0.12.0/contrib/auto-render.mjs";
import { Sectional } from "/assets/lib/sectional/1.0.0/sectional.js";
import { Remarkable } from "/assets/lib/remarkable/2.0.0/remarkable.js";
import { default as CryptoES } from "/assets/lib/crypto-es/1.2.6/index.js";
import { ShakeElement } from "/assets/util.mjs"

const DEBUG = false;

const AUTH_MESSAGE = "U2FsdGVkX19BSw9elWK2K5nKVbmFScJVxM6QpumRDhRy1ZBOdJoVJjMC7B4Y+g2/";

let privateData = null;

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

export let uuidv4 = (quotation = false) => {
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
			if (!this._display) {
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
const privateWrapper = document.querySelector("#private-wrapper");
const privateMenu = document.querySelector("#private-menu");
const contentWrapper = document.querySelector("#private-content");
const timeDisplayer = document.querySelector("#session-timer");

let overlay = null;
export let sectional = null;

// Work only if the current path is valid
if (new URL(window.location).pathname === "/private/") {
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
		hideToc();
	};
}

function auth(passphrase) {
	overlay.show();

	try {
		let result = CryptoES.AES.decrypt(AUTH_MESSAGE, passphrase).toString(CryptoES.enc.Utf8);
		if (result) {
			sessionStorage.setItem("passphrase", passphrase);

			// Set timer
			resetTimer();

			// Loading private data
			fetch(DEBUG ? "/private/data.json" : "/private/data.txt").then(response => {
				if (response.ok) return response.text();
				return {};
			}).then(data => {
				try {
					let decrypted = DEBUG ? data : CryptoES.AES.decrypt(data, passphrase).toString(CryptoES.enc.Utf8);
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
				privateData = json;
				loadData(privateData);
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
	privateData = null;

	entryWrapper.classList.remove("hidden");
	if (inputPassphrase) inputPassphrase.focus();
	privateWrapper.classList.add("hidden");

	let el = document.querySelector("#auth-message");
	if (msg && typeof msg === "string") {
		el.innerHTML = msg;
		if (shake) ShakeElement(el, 30, 3);
	} else el.innerHTML = "";
}
function authenticated() {
	console.log("Authenticated!");
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
		type: "entry"
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

function loadData(data) {
	if (!data) return;
	if (DEBUG) inspectData(data);

	sectional = new Sectional(contentWrapper, data, {
		insertSections: false,
		callback: (el, ...params) => {
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
			let entity = (id in ArticleHierarchy) ? ArticleHierarchy[id] : privateData[id];
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
				hideToc();
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
	document.querySelector("#stnl-5fXnqmbl53aqjA7bUoFcdF").click();
	overlay.hide(authenticated);
}

function article(id) {
	if (checkSession()) {
		resetTimer();
		if (sectional) {
			sectional.clearViewport();
			sectional.article(id, false);
		}
	} else {
		signout("Session expired!");
	}
}

function dropdown(id, parentEl) {
	let li = document.createElement("li");
	if (id) {
		let entity = (id in ArticleHierarchy) ? ArticleHierarchy[id] : privateData[id];
		if (!entity) return;

		li.id = `stnl-${id}`;
		li.innerHTML = entity.title;
		li.addEventListener("mousedown", e => e.stopPropagation());
		li.addEventListener("click", (e) => {
			collapseAllDropdowns();
			deselectMenuItems();
			hideToc();
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
	let entity = (id in ArticleHierarchy) ? ArticleHierarchy[id] : privateData[id];
	if (!entity) return;

	if (checkSession()) {
		resetTimer();
		if (entity.action === "exportData") exportData();
		else if (entity.action === "signout") signout();
	} else {
		signout("Session expired!");
	}
}

export function exportData() {
	let deepCopied = JSON.parse(JSON.stringify(privateData));
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

function inspectData(data) {
	// TEST #1: Set reference counts for each data items
	let reference = (parent, id) => {
		if (!id || id.length !== 22) return;
		if (data.hasOwnProperty(id)) {
			let entity = data[id];

			// Metadata
			if (!entity.hasOwnProperty("_parents")) entity._parents = [];
			entity._parents.push(parent);

			// Necessary properties
			if (entity.children)
				entity.children.forEach(childId => { reference(id, childId); });
			if (entity.content && typeof entity.content === "object")
				Object.keys(entity.content).forEach((key) => { reference(id, entity.content[key]); });

			// Optional properties
			if (entity.classlist)
				reference(id, entity.classlist);
			if (entity.properties)
				reference(id, entity.properties);
			if (entity.action)
				reference(id, entity.action);

		} else console.log(`--- Broken pointer: parent("${parent}") -> target("${id}")"`);
	}
	reference(null, Sectional.getEntry());

	// TEST #2: Check if invalid data exists and get parent object
	let multiRefs = [];
	let standalone = {};
	Object.keys(data).forEach(id => {
		let obj = data[id];
		if (obj.hasOwnProperty("_parents")) {
			if (obj._parents.length > 1)
				multiRefs.push({ id: id, count: obj._parents.length });
		} else standalone[id] = (obj);
	});
	multiRefs.msort([{ key: "count", order: "descending" }]);
	if (multiRefs.length) {
		console.log("--- Multi-referenced entities: ");
		multiRefs.forEach((obj, order) => {
			let item = data[obj.id];
			if (item.type !== "action" && item.type !== "properties" && item.type !== "classlist")
				console.log(`"${obj.id}"`, item);
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
function hideToc() {
	let toc = document.querySelector("toc");
	if (toc) toc.classList.add("hidden");
}
