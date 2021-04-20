import katex from "/assets/lib/katex/0.12.0/katex.mjs";
import renderMathInElement from "/assets/lib/katex/0.12.0/contrib/auto-render.mjs";
import { Debounce } from "/assets/util.mjs"

Element.prototype.removeAllChildren = function () {
	while (this.lastChild) this.removeChild(this.lastChild);
}

/**
 * Sort array of objects by multiple keys and its order.
 * @param {Object} options [ { "key": key1, "order": null|"ascending"|"descending" }, ... ]
 */
Array.prototype.msort = function (options) {
	if (!options || !Array.isArray(options) || !options.length) return this;
	this.sort(function (a, b) {
		let compare = 0;
		for (let i = 0; i < options.length && compare == 0; i++) {
			let key = options[i].key;
			let order = options[i].order;
			order = (!order) ? 0 : (order === "ascending" ? 1 : -1);
			if (!order) continue;
			compare = a[key] == b[key] ? 0 : (a[key] > b[key] ? 1 : -1) * order;
		}
		return compare;
	});
	return this;
};

// Transform contents
const pageContent = document.querySelector(".page-content");
if (pageContent) {
	// Render math equations in table-of-content
	pageContent.querySelectorAll("script[type='math/tex; mode=display']").forEach(function (el) {
		el.outerHTML = katex.renderToString(el.textContent.replace(/%.*/g, ''), { displayMode: true });
	});

	// Render math equations automatically
	renderMathInElement(pageContent, {
		throwOnError: false,
		delimiters: [
			{ left: "$$", right: "$$", display: true },
			{ left: "\\[", right: "\\]", display: true },
			{ left: "$", right: "$", display: false },
			{ left: "\\(", right: "\\)", display: false },
		]
	});

	// Sequence diagrams
	pageContent.querySelectorAll(".language-seq").forEach(function (seq) {
		let div = document.createElement("div");
		seq.parentNode.parentNode.insertBefore(div, seq.parentNode);
		Diagram.parse(seq.innerText).drawSVG(div, { theme: "simple" });
		seq.parentNode.parentNode.removeChild(seq.parentNode);
	});

	// Flowchart
	pageContent.querySelectorAll(".language-flow").forEach(function (flow) {
		let div = document.createElement("div");
		flow.parentNode.parentNode.insertBefore(div, flow.parentNode);
		flowchart.parse(flow.innerText).drawSVG(div, flowchartOptions);
		flow.parentNode.parentNode.removeChild(flow.parentNode);
	});

	// Image alignment in paragraph
	pageContent.querySelectorAll("p").forEach(function (paragraph) {
		if (paragraph.querySelectorAll("img").length) {
			paragraph.classList.add("center");
		}
	});

	// Add title to anchor tags
	pageContent.querySelectorAll("a").forEach(function (anchor) {
		if (!anchor.hasAttribute("title")) {
			if (anchor.parentNode.classList.contains("post-meta-category")) {
				anchor.setAttribute("title", "category: " + anchor.innerHTML);
			} else if (anchor.parentNode.classList.contains("post-meta-tags")) {
				anchor.setAttribute("title", "tag: " + anchor.innerHTML.replace(/^#+/, ""));
			} else {
				anchor.setAttribute("title", anchor.href);
			}
			let current = window.location || window.document.location;
			if (anchor.hostname !== current.hostname) {
				anchor.setAttribute("target", "_blank");
			}
		}
	});

	// Add caption under the figure
	let images = pageContent.querySelectorAll("img");
	for (let i = 0; i < images.length; i++) {
		images[i].addEventListener("click", function (e) {
			window.open(this.src);
		});
		let alt = images[i].getAttribute("alt");
		if (alt) {
			let figcaption = document.createElement("figcaption");
			figcaption.innerHTML = alt;
			images[i].parentNode.insertBefore(figcaption, images[i].nextSibling);
		}
	}

	// Add caption under the table
	let tables = pageContent.querySelectorAll("table");
	for (let i = 0; i < tables.length; i++) {
		let alt = tables[i].getAttribute("alt");
		if (alt) {
			let tblcaption = document.createElement("caption");
			tblcaption.innerHTML = alt;
			tables[i].parentNode.insertBefore(tblcaption, tables[i].nextSibling);
		}
	}
}

// Add table-of-content to headings
let updateToc = Debounce(function () {
	const postContent = document.querySelector(".post-content");
	const toc = document.querySelector("#toc");
	if (toc) {
		toc.removeAllChildren();

		let divTop = document.createElement("div");
		divTop.setAttribute("tid", "Top");
		divTop.classList.add("toc-item", "level-2");
		divTop.innerHTML = "&#x1f851; Top";
		divTop.addEventListener("click", function (e) {
			document.body.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		});
		toc.appendChild(divTop);

		Array.from(postContent.querySelectorAll("h2, h3, h4")).forEach(function (heading) {
			let div = document.createElement("div");
			div.innerHTML = heading.innerHTML;
			div.setAttribute("tid", heading.id);
			div.addEventListener("click", function (e) {
				let target = document.getElementById(this.getAttribute("tid"));
				if (target) target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
			});
			if (heading.tagName === "H2") {
				div.classList.add("toc-item", "level-2");
			} else if (heading.tagName === "H3") {
				div.classList.add("toc-item", "level-3");
			} else if (heading.tagName === "H4") {
				div.classList.add("toc-item", "level-4");
			}
			toc.appendChild(div);
		});
	}
}, 300);

let observer = null;
const postContent = document.querySelector(".post-content");
if (postContent) {
	observer = new MutationObserver(updateToc);
	observer.observe(postContent, { attributes: false, childList: true, subtree: false });
	updateToc();
}

document.querySelector("#search-input").focus();
