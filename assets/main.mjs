import { ShakeElement } from "/assets/util.mjs"

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
		var compare = 0;
		for (var i = 0; i < options.length && compare == 0; i++) {
			var key = options[i].key;
			var order = options[i].order;
			order = (!order) ? 0 : (order === "ascending" ? 1 : -1);
			if (!order) continue;
			compare = a[key] == b[key] ? 0 : (a[key] > b[key] ? 1 : -1) * order;
		}
		return compare;
	});
	return this;
};

// Auto focus on passphrase
var inputPassphrase = document.querySelector("#input-passphrase");
if (inputPassphrase) {
	inputPassphrase.addEventListener("keypress", function (e) {
		e.stopPropagation();
	});
	inputPassphrase.focus();
}

// Main
var doc = document.querySelector(".page-content");

// Render math equations
doc.querySelectorAll("script[type='math/tex; mode=display']").forEach(function (el) {
	el.outerHTML = katex.renderToString(el.textContent.replace(/%.*/g, ''), { displayMode: true });
});
renderMathInElement(doc, {
	throwOnError: false,
	delimiters: [
		{ left: "$$", right: "$$", display: true },
		{ left: "\\[", right: "\\]", display: true },
		{ left: "$", right: "$", display: false },
		{ left: "\\(", right: "\\)", display: false },
	]
});

// Sequence diagrams
doc.querySelectorAll(".language-seq").forEach(function (seq) {
	var div = document.createElement("div");
	seq.parentNode.parentNode.insertBefore(div, seq.parentNode);
	Diagram.parse(seq.innerText).drawSVG(div, { theme: "simple" });
	seq.parentNode.parentNode.removeChild(seq.parentNode);
});

// Flowchart
doc.querySelectorAll(".language-flow").forEach(function (flow) {
	var div = document.createElement("div");
	flow.parentNode.parentNode.insertBefore(div, flow.parentNode);
	flowchart.parse(flow.innerText).drawSVG(div, flowchartOptions);
	flow.parentNode.parentNode.removeChild(flow.parentNode);
});

// Image alignment in paragraph
doc.querySelectorAll("p").forEach(function (paragraph) {
	if (paragraph.querySelectorAll("img").length) {
		paragraph.classList.add("center");
	}
});

// Add title to anchor tags
doc.querySelectorAll("a").forEach(function (anchor) {
	if (!anchor.hasAttribute("title")) {
		if (anchor.parentNode.classList.contains("post-meta-category")) {
			anchor.setAttribute("title", "category: " + anchor.innerHTML);
		} else if (anchor.parentNode.classList.contains("post-meta-tags")) {
			anchor.setAttribute("title", "tag: " + anchor.innerHTML.replace(/^#+/, ""));
		} else {
			anchor.setAttribute("title", anchor.href);
		}
		var current = window.location || window.document.location;
		if (anchor.hostname !== current.hostname) {
			anchor.setAttribute("target", "_blank");
		}
	}
});

// Add caption under the figure
var images = doc.querySelectorAll("img");
for (var i = 0; i < images.length; i++) {
	images[i].addEventListener("click", function (e) {
		window.open(this.src);
	});
	var alt = images[i].getAttribute("alt");
	if (alt) {
		var figcaption = document.createElement("figcaption");
		figcaption.innerHTML = alt;
		images[i].parentNode.insertBefore(figcaption, images[i].nextSibling);
	}
}

// Add caption under the table
var tables = doc.querySelectorAll("table");
for (var i = 0; i < tables.length; i++) {
	var alt = tables[i].getAttribute("alt");
	if (alt) {
		var tblcaption = document.createElement("tblcaption");
		tblcaption.innerHTML = alt;
		tables[i].parentNode.insertBefore(tblcaption, tables[i].nextSibling);
	}
}

// Add table-of-content to headings
function updateToc() {
	var postContent = document.querySelector(".post-content");
	var toc = document.querySelector("toc");
	toc.removeAllChildren();

	var headings = postContent.querySelectorAll("h2, h3, h4");
	if (headings.length < 2) {
		Array.from(postContent.querySelectorAll("h2, h3, h4")).forEach(function (heading) {
			heading.classList.add("no-toc");
		});
		return;
	}

	Array.from(postContent.querySelectorAll("h2, h3, h4")).forEach(function (heading) {
		var div = document.createElement("div");
		div.innerHTML = heading.innerHTML;
		div.setAttribute("tid", heading.id);
		div.addEventListener("click", function (e) {
			var target = document.getElementById(this.getAttribute("tid"));
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
	Array.from(postContent.querySelectorAll("h2, h3, h4")).forEach(function (heading, order) {
		heading.addEventListener("click", function (e) {
			var wrapperRect = document.querySelector(".wrapper").getBoundingClientRect();
			var wrapperRight = wrapperRect.x + wrapperRect.width;
			var x = 0, y = 0;

			var lastNode = heading.firstChild;
			for (var i = heading.childNodes.length - 1; i >= 0; i--) {
				if (heading.childNodes[i].nodeType === 1) {				// Element node
					lastNode = heading.childNodes[i];
					var range = document.createRange();
					range.selectNode(lastNode);
					var rect = range.getBoundingClientRect();
					x = ((rect.x + rect.width + toc.getBoundingClientRect().width) < wrapperRight) ? rect.x + rect.width : (wrapperRight - toc.getBoundingClientRect().width);
					y = rect.y + rect.height + 10 + document.documentElement.scrollTop;
					break;
				} else if (heading.childNodes[i].nodeType === 3) {		// Text node
					if (heading.childNodes[i].nodeValue) {
						lastNode = heading.childNodes[i];
						var range = document.createRange();
						range.selectNodeContents(lastNode);
						var rects = range.getClientRects();
						var rect = rects[rects.length - 1];
						x = ((rect.x + rect.width + toc.getBoundingClientRect().width) < wrapperRight) ? rect.x + rect.width : (wrapperRight - toc.getBoundingClientRect().width);
						y = rect.y + rect.height + 10 + document.documentElement.scrollTop;
						break;
					}
				}
			}
			toc.setAttribute("style", "left: " + parseInt(x) + "px; top: " + parseInt(y) + "px;");
			for (var i = 0; i < toc.children.length; i++) {
				if (i === order) toc.children[i].classList.add("cur-item");
				else toc.children[i].classList.remove("cur-item");
			}
			toc.classList.remove("hidden");
		});
	});
}

let observer = null;
var postContent = document.querySelector(".post-content");
if (postContent) {
	observer = new MutationObserver(updateToc);
	observer.observe(postContent, { attributes: false, childList: true, subtree: false });
	updateToc();
}
var toc = document.querySelector("toc");
toc.addEventListener("mousedown", function (e) {
	e.stopPropagation();
});

window.addEventListener("mousedown", function () {
	var toc = document.querySelector("toc");
	if (toc) toc.classList.add("hidden");
});
window.addEventListener("keydown", function (e) {
	var toc = document.querySelector("toc");
	if (toc) toc.classList.add("hidden");
});
window.addEventListener("resize", function (e) {
	var toc = document.querySelector("toc");
	if (toc) toc.classList.add("hidden");
});
