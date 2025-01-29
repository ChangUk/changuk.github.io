import DocumentManager from "./lib/document-manager-1.0.0.esm.min.js";

const debounce = (callback, wait, immediate) => {
	immediate = immediate || false;
	let _;
	let timeout;
	return function () {
		_ = document.activeElement;
		const context = this, args = arguments;
		const later = function () {
			_.focus();
			timeout = null;
			if (!immediate) callback.apply(context, args);
		}
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) callback.apply(context, args);
	};
};

const privateData = await fetch("../private.json").then(res => res.json());

let dm = null;
let collection = null;

const createManager = (type, searchOptions) => {
	return new DocumentManager({
		storage: type,
		name: "document-manager",
		config: (type === "firestore") ? privateData.FirebaseAppConfig : {},
		search: searchOptions
	});
};
const searchOptions = {
	orderBy: ["-date", "title"]
};

const headingSearch = document.querySelector("#demo-search");
headingSearch.innerHTML = `Search: order by "${searchOptions.orderBy.join(", ")}"`;

const searchInput = document.querySelector("#search-input");
searchInput.oninput = debounce((e) => {
	if (!collection) return;
	collection.search(e.target.value.length ? {
		category: ["array-contains", e.target.value]
	} : undefined, searchOptions).then(results => {
		showSearchResults(results);
	});
}, 300);
const searchResult = document.querySelector("#search-result");
const viewer = document.querySelector("#viewer");

const btnNewId = document.querySelector("#btn-newid");
btnNewId.addEventListener("click", (e) => {
	document.querySelector("#document-id").value = dm.randomId();
});

const template = "{\n    \"category\": [],\n    \"content\": \"\",\n    \"date\": 0,\n    \"tags\": [],\n    \"title\": \"\"\n}"
const btnTemplate = document.querySelector("#btn-template");
btnTemplate.addEventListener("click", (e) => {
	document.querySelector("#editor").value = template;
});

const btnCreate = document.querySelector("#btn-create");
btnCreate.addEventListener("click", async (e) => {
	let docId = document.querySelector("#document-id").value;
	let content = document.querySelector("#editor").value;
	if (!content) {
		alert("Content is empty!");
		return;
	}
	collection.set(docId, content).then(collection.search).then((results) => {
		showSearchResults(results);
	});
});

const showSearchResults = async (results) => {
	searchResult.innerHTML = "";
	for (let i = 0; i < results.length; i++) {
		collection.get(results[i]).then((doc) => {
			let div = document.createElement("div");
			div.classList.add("result-item");
			div.innerHTML = doc.title;
			div.setAttribute("id", doc._id);
			div.onclick = async (e) => {
				viewer.innerHTML = JSON.stringify(await collection.get(e.target.getAttribute("id")), " ", 4);
			};
			searchResult.appendChild(div);
		});
	}
}

// Get sample data
fetch("sample-data.json").then(res => res.json()).then(async (json) => {
	const storageType = "indexeddb";
	document.querySelector("#demo-title").innerHTML = `DocumentManager Demo - "${storageType}"`;

	const searchOptions = {
		orderBy: ["-date", "title"],
		fuzzy: false,
	};
	dm = createManager(storageType, searchOptions);
	if (!dm) return;

	collection = await dm.collection("documents");
	if (!collection) return;

	for (const id in json["documents"]) await collection.set(id, json["documents"][id]);
	searchInput.dispatchEvent(new Event("input"));
});
