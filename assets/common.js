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

mandatory = () => {
	throw new Error("Missing parameter!");
}

function debounce(callback, wait, immediate = false) {
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
}

function throttle(callback, wait, immediate = false) {
	var _;
	let timeout = null;
	let initCall = true;
	return function() {
		_ = document.activeElement;
		var context = this, args = arguments;
		const callNow = immediate && initCall;
		const next = function () {
			_.focus();
			timeout = null;
			callback.apply(context, args);
		}
		if (callNow) {
			initCall = false;
			next();
		}
		if (!timeout) timeout = setTimeout(next, wait);
	};
}

function shakeElement(element, shakes = 15, magnitude = 16, angular = false) {
	var shakingElements = [];

	// First set the initial tilt angle to the right (+1) 
	var tiltAngle = 1;

	// A counter to count the number of shakes
	var counter = 1;

	// The total number of shakes (there will be 1 shake per frame)
	var numberOfShakes = shakes;

	// Capture the element's position and angle so you can restore them after the shaking has finished
	var startX = 0, startY = 0, startAngle = 0;

	// Divide the magnitude into 10 units so that you can reduce the amount of shake by 10 percent each frame
	var magnitudeUnit = magnitude / numberOfShakes;

	// The `randomInt` helper function
	var randomInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	// Add the element to the `shakingElements` array if it isn't already there
	if (shakingElements.indexOf(element) === -1) {
		shakingElements.push(element);

		// Add an `updateShake` method to the element.
		// The `updateShake` method will be called each frame
		// in the game loop. The shake effect type can be either
		// up and down (x/y shaking) or angular (rotational shaking).
		if (angular) angularShake();
		else upAndDownShake();
	}

	function upAndDownShake() {
		// Shake the element while the `counter` is less than the `numberOfShakes`
		if (counter < numberOfShakes) {
			// Reset the element's position at the start of each shake
			element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';

			// Reduce the magnitude
			magnitude -= magnitudeUnit;

			// Randomly change the element's position
			var randomX = randomInt(-magnitude, magnitude);
			var randomY = randomInt(-magnitude, magnitude);

			element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';

			// Add 1 to the counter
			counter += 1;

			requestAnimationFrame(upAndDownShake);
		}

		// When the shaking is finished, restore the element to its original 
		// position and remove it from the `shakingElements` array
		if (counter >= numberOfShakes) {
			element.style.transform = 'translate(' + startX + ', ' + startY + ')';
			shakingElements.splice(shakingElements.indexOf(element), 1);
		}
	}

	function angularShake() {
		if (counter < numberOfShakes) {
			// Reset the element's rotation
			element.style.transform = 'rotate(' + startAngle + 'deg)';

			// Reduce the magnitude
			magnitude -= magnitudeUnit;

			// Rotate the element left or right, depending on the direction, by an amount in radians that matches the magnitude
			var angle = Number(magnitude * tiltAngle).toFixed(2);
			element.style.transform = 'rotate(' + angle + 'deg)';
			counter += 1;

			// Reverse the tilt angle so that the element is tilted in the opposite direction for the next shake
			tiltAngle *= -1;

			requestAnimationFrame(angularShake);
		}

		// When the shaking is finished, reset the element's angle and remove it from the `shakingElements` array
		if (counter >= numberOfShakes) {
			element.style.transform = 'rotate(' + startAngle + 'deg)';
			shakingElements.splice(shakingElements.indexOf(element), 1);
		}
	}
}

let observer;

window.addEventListener("DOMContentLoaded", function() {
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
});
