import katex from "/assets/lib/katex/0.12.0/katex.mjs";
import renderMathInElement from "/assets/lib/katex/0.12.0/contrib/auto-render.mjs";

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
function updateToc() {
	const postContent = document.querySelector(".post-content");
	let toc = document.querySelector("toc");
	toc.removeAllChildren();

	let headings = postContent.querySelectorAll("h2, h3, h4");
	if (headings.length < 2) {
		Array.from(postContent.querySelectorAll("h2, h3, h4")).forEach(function (heading) {
			heading.classList.add("no-toc");
		});
		return;
	}

	Array.from(postContent.querySelectorAll("h2, h3, h4")).forEach(function (heading) {
		let div = document.createElement("div");
		div.innerHTML = heading.innerHTML;
		div.setAttribute("tid", heading.id);
		div.addEventListener("click", function (e) {
			let target = document.getElementById(this.getAttribute("tid"));
			if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
			toc.classList.add("hidden");
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
	Array.from(postContent.querySelectorAll("h2, h3, h4")).forEach((heading, order) => {
		heading.addEventListener("click", (e) => {
			const privateContainer = document.querySelector("#private-page");
			const container = privateContainer ? privateContainer : document.documentElement;

			const wrapperRect = document.querySelector(".wrapper").getBoundingClientRect();
			const wrapperRight = wrapperRect.x + wrapperRect.width;
			let x = 0, y = 0;

			let lastNode = heading.firstChild;
			for (let i = heading.childNodes.length - 1; i >= 0; i--) {
				if (heading.childNodes[i].nodeType === 1) {				// Element node
					lastNode = heading.childNodes[i];
					let range = document.createRange();
					range.selectNode(lastNode);
					let rect = range.getBoundingClientRect();
					x = ((rect.x + rect.width + toc.getBoundingClientRect().width) < wrapperRight) ? rect.x + rect.width : (wrapperRight - toc.getBoundingClientRect().width);
					y = rect.y + rect.height + 10 + container.scrollTop;
					break;
				} else if (heading.childNodes[i].nodeType === 3) {		// Text node
					if (heading.childNodes[i].nodeValue) {
						lastNode = heading.childNodes[i];
						let range = document.createRange();
						range.selectNodeContents(lastNode);
						let rects = range.getClientRects();
						let rect = rects[rects.length - 1];
						x = ((rect.x + rect.width + toc.getBoundingClientRect().width) < wrapperRight) ? rect.x + rect.width : (wrapperRight - toc.getBoundingClientRect().width);
						y = rect.y + rect.height + 10 + container.scrollTop;
						break;
					}
				}
			}

			toc.setAttribute("style", "left: " + parseInt(x) + "px; top: " + parseInt(y) + "px;");
			for (let i = 0; i < toc.children.length; i++) {
				if (i === order) toc.children[i].classList.add("cur-item");
				else toc.children[i].classList.remove("cur-item");
			}
			toc.classList.remove("hidden");
		});
	});
}

let observer = null;
let postContent = document.querySelector(".post-content");
if (postContent) {
	observer = new MutationObserver(updateToc);
	observer.observe(postContent, { attributes: false, childList: true, subtree: false });
	updateToc();
}
let toc = document.querySelector("toc");
toc.addEventListener("mousedown", function (e) {
	e.stopPropagation();
});

window.addEventListener("mousedown", function () {
	let toc = document.querySelector("toc");
	if (toc) toc.classList.add("hidden");
});
window.addEventListener("keydown", function (e) {
	let toc = document.querySelector("toc");
	if (toc) toc.classList.add("hidden");
});
window.addEventListener("resize", function (e) {
	let toc = document.querySelector("toc");
	if (toc) toc.classList.add("hidden");
});
