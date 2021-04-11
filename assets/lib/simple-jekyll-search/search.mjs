import { Debounce } from "/assets/util.mjs"

const DEBOUNCE_TIME = 300;
require([
	"/assets/lib/simple-jekyll-search/1.9.1/simple-jekyll-search.min.js"
], () => {
	SimpleJekyllSearch({
		searchInput: document.querySelector("#search-input"),
		resultsContainer: document.querySelector("#search-result"),
		json: "/search.json",
		searchResultTemplate: document.querySelector("#search-result-template").innerHTML.toString(),
		noResultsText: "No results found.",
		fuzzy: false,
		exclude: ["Welcome"]
	});

	let openSearchResult = /*Debounce(*/(input) => {
		if (input && input.length) {
			document.querySelector("#content-wrapper").classList.add("hidden");
			document.querySelector("#search-result-wrapper").classList.remove("hidden");
		} else {
			document.querySelector("#content-wrapper").classList.remove("hidden");
			document.querySelector("#search-result-wrapper").classList.add("hidden");
		}
	}/*, DEBOUNCE_TIME);*/

	let searchInput = document.querySelector("#search-input");
	searchInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			let matches = e.target.value.match(/^\/.+/g);
			if (matches) {
				const funcName = e.target.value.toLowerCase().replace(/^\/+/, '');
				const funcPath = `/functions/${funcName}/index.mjs`;
				import(funcPath)
					.then(mod => {
						e.target.value = "";
						mod.default();
					}).catch(err => {
						e.target.value = "";
					});
			}
		} else if (e.key === "Escape") {
			e.target.value = "";
			openSearchResult();
		}
	});
	searchInput.addEventListener("input", (e) => {
		let input = e.target.value;
		let matches = input.match(/^\/.+/g);
		if (!matches) openSearchResult(input.replace(/^\/+/, ''));
	});

	if (searchInput.value.length && sessionStorage.searchdata) {
		document.querySelector("#search-result").innerHTML = sessionStorage.searchdata;
		document.querySelector("#content-wrapper").classList.add("hidden");
		document.querySelector("#search-result-wrapper").classList.remove("hidden");
		searchInput.setSelectionRange(0, searchInput.value.length);
	}

	if (document.querySelector("#groupby")) {
		// Warning: do not use `element.classList.remove("hidden")` instead of `element.style.display`;
		let categoryValue = "category-" + new URL(document.URL).searchParams.get("category");
		if (document.getElementById(categoryValue))
			document.getElementById(categoryValue).style.display = "block";
		let tagValue = "tag-" + new URL(document.URL).searchParams.get("tag");
		if (document.getElementById(tagValue))
			document.getElementById(tagValue).style.display = "block";

		if (!document.getElementById(categoryValue) && !document.getElementById(tagValue))
			window.location.href = "/404.html";
	}

	document.addEventListener("keypress", function () {
		let searchInput = document.querySelector("#search-input");
		if (document.activeElement !== searchInput) searchInput.focus();
	});
}, (e) => {
	console.error(e);
});
