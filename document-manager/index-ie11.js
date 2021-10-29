var FileManager = (function () {
	return {
		readText: function (abspath) {
			var astream = new ActiveXObject("ADODB.Stream");
			astream.Open();
			astream.Charset = "UTF-8";
			astream.LoadFromFile(abspath);
			var content = astream.ReadText();
			astream.Close();
			return content;
		}
	}
})();

function debounce(callback, wait, immediate) {
	immediate = immediate || false;
	var _;
	var timeout;
	return function () {
		_ = document.activeElement;
		var context = this, args = arguments;
		var later = function () {
			_.focus();
			timeout = null;
			if (!immediate) callback.apply(context, args);
		}
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) callback.apply(context, args);
	};
};

let dm = null;
let collection = null;

function createManager(type, searchOptions) {
	return new DocumentManager({
		storage: type,
		name: "document-manager",
		search: searchOptions
	});
}
var searchOptions = {
	orderBy: ["-date", "title"]
};

var headingSearch = document.querySelector("#demo-search");
headingSearch.innerHTML = "Search: order by \"" + searchOptions.orderBy.join(", ") + "\"";

var searchInput = document.querySelector("#search-input");
searchInput.oninput = debounce(function (e) {
	if (!collection) return;
	collection.search(e.target.value.length ? {
		category: ["array-contains", e.target.value]
	} : undefined, searchOptions).then(function (results) {
		showSearchResults(results);
	});
}, 300);
var searchResult = document.querySelector("#search-result");
var viewer = document.querySelector("#viewer");

var btnNewId = document.querySelector("#btn-newid");
btnNewId.addEventListener("click", function (e) {
	document.querySelector("#document-id").value = dm.randomId();
});

var template = "{\n    \"category\": \"[]\",\n    \"content\": \"\",\n    \"date\": \"\",\n    \"tags\": \"[]\",\n    \"title\": \"\"\n}"
var btnTemplate = document.querySelector("#btn-template");
btnTemplate.addEventListener("click", function (e) {
	document.querySelector("#editor").value = template;
});

var btnCreate = document.querySelector("#btn-create");
btnCreate.addEventListener("click", function (e) {
	var docId = document.querySelector("#document-id").value;
	var content = document.querySelector("#editor").value;
	if (!content) {
		alert("Content is empty!");
		return;
	}
	collection.set(docId, content);
	collection.search().then(function (results) {
		showSearchResults(results);
	})
});

function showSearchResults(results) {
	searchResult.innerHTML = "";
	for (var i = 0; i < results.length; i++) {
		collection.get(results[i]).then(function (doc) {
			var div = document.createElement("div");
			div.classList.add("result-item");
			div.innerHTML = doc.title;
			div.setAttribute("id", doc._id);
			div.onclick = function (e) {
				collection.get(e.target.getAttribute("id")).then(function (doc) {
					viewer.innerHTML = JSON.stringify(doc, " ", 4);
				});
			};
			searchResult.appendChild(div);
		});
	}
}

var xhr = new XMLHttpRequest();
xhr.open("GET", "/private.json");
xhr.onload = function (e) {
	var privateData = JSON.parse(e.target.response);

	var json = JSON.parse(FileManager.readText(privateData.SampleDataPath));
	var storageType = "json";
	document.querySelector("#demo-title").innerHTML = "DocumentManager Demo - \"" + storageType + "\"";

	var searchOptions = {
		orderBy: ["-date", "title"],
		fuzzy: false,
	};
	dm = createManager(storageType, searchOptions);
	if (dm) {
		dm.collection("documents").then(function (instance) {
			collection = instance;

			var promises = [];
			for (var id in json["documents"]) promises.push(collection.set(id, json["documents"][id]));
			Promise.all(promises).then(function (result) {
				var event = document.createEvent("Event");
				event.initEvent('input', true, true);
				searchInput.dispatchEvent(event);
			});
		});
	}
};
xhr.send();
