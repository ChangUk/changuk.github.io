class DataRenderer {
	constructor (view) {
		if (!view) throw new Error("Missing parameter.");
		this.dom = view;
		this.data = {};
		this.headings = [];
		this.extra = {};
	}

	setData(data) {
		this.data = data;
	}

	getDOM() {
		return this.dom;
	}

	clear() {
		// Remove all children of dom
		while (this.dom.firstChild) this.dom.removeChild(this.dom.lastChild);
		this.headings = [];
	}

	section(parent, id) {
		var heading = document.createElement("h2");
		heading.id = "uuid-" + id;
		heading.innerHTML = this.data[id].content;
		parent.appendChild(heading);
		if (this.data[id].children) {
			this.data[id].children.forEach((childId) => {
				this[this.data[childId].type](parent, childId);
			});
		}
	}

	subsection(parent, id) {
		var heading = document.createElement("h3");
		heading.id = "uuid-" + id;
		heading.innerHTML = this.data[id].content;
		parent.appendChild(heading);
		if (this.data[id].children) {
			this.data[id].children.forEach((childId) => {
				this[this.data[childId].type](parent, childId);
			});
		}
	}

	subsubsection(parent, id) {
		var heading = document.createElement("h4");
		heading.id = "uuid-" + id;
		heading.innerHTML = this.data[id].content;
		parent.appendChild(heading);
		if (this.data[id].children) {
			this.data[id].children.forEach((childId) => {
				this[this.data[childId].type](parent, childId);
			});
		}
	}

	paragraph(parent, id) {
		var p = document.createElement("p");
		p.id = "uuid-" + id;
		p.innerHTML = this.data[id].content;
		parent.appendChild(p);
		if (this.data[id].children) {
			this.data[id].children.forEach((childId) => {
				this[this.data[childId].type](p, childId);
			});
		}
	}

	table(parent, id) {
		var tableObj = this.data[id];
		var properties = (tableObj.properties && this.data[tableObj.properties].content) ? this.data[tableObj.properties].content : {};
		if (!this.extra.hasOwnProperty(id)) {
			this.extra[id] = {};
			this.extra[id].properties = properties;
		}

		var table = document.createElement("table");
		table.id = "uuid-" + id;
		parent.appendChild(table);
		if (tableObj.content && tableObj.content.header) {
			this.tableHeader(id, table, tableObj.content.header);
		}
		if (tableObj.content && tableObj.content.body) {
			this.tableBody(id, table, tableObj.content.body);
		}
		if (tableObj.content && tableObj.content.footer) {
			this.tableFooter(id, table, tableObj.content.footer);
		}
	}

	tableHeader(tid, parent, id) {
		var thead = document.createElement("thead");
		parent.appendChild(thead);
		const getHeaderDepth = (id) => {
			if (this.data[id].children) {
				var max = 0;
				this.data[id].children.forEach((childId) => {
					var depth = getHeaderDepth(childId) + 1;
					if (max < depth) {
						thead.appendChild(document.createElement("tr"));
						max = depth;
					}
				});
				return max;
			} else {
				thead.appendChild(document.createElement("tr"));
				return 0;
			}
		}
		var depth = getHeaderDepth(id);
		if (this.data[id].children) {

			// TODO: All types of children should be equal. Add checking logic here.

			this.data[id].children.forEach((childId, order) => {
				this[this.data[childId].type](tid, thead, childId, depth, 0, order);
			});
		}
	}

	tableColumn(tid, thead, id, depth, row, col) {
		var th = document.createElement("th");
		th.id = "uuid-" + id;
		th.innerHTML = this.data[id].content;
		thead.children[row].appendChild(th);

		if (this.data[id].action) this.setAction(th, id);

		if (th.previousSibling) {
			col = parseInt(th.previousSibling.getAttribute("col"));
			if (th.previousSibling.hasAttribute("colspan")) col += parseInt(th.previousSibling.getAttribute("colspan"));
			else col += 1;
		}
		th.setAttribute("col", col);
		th.setAttribute("row", row);

		var prop = this.extra[tid].properties;
		if (prop) {
			if (prop.fitWidth && prop.fitWidth[col]) th.classList.add("fit-width");
		}
		if (this.data[id].children) {
			
			// TODO: All types of children should be equal. Add checking logic here.

			var max = 0;
			this.data[id].children.forEach((childId, order) => {
				var cols = this[this.data[childId].type](tid, thead, childId, depth, row + 1, col + order) + 1;
				if (max < cols) max = cols;
			});
			if (max > 1) th.setAttribute("colspan", max);
			return max;
		} else {
			if (row < depth - 1) th.setAttribute("rowspan", depth - row);
			return 1;
		}
	}

	tableBody(tid, parent, id) {
		var tbody = document.createElement("tbody");
		parent.appendChild(tbody);
		const getHeaderDepth = (id) => {
			if (this.data[id].children) {
				var max = 0;
				this.data[id].children.forEach((childId) => {
					if (this.data[childId].type === "tableRowHeader") {
						var depth = getHeaderDepth(childId) + 1;
						if (max < depth) max = depth;
					}
				});
				return max;
			} else return 0;
		}
		var depth = getHeaderDepth(id);
		if (this.data[id].children) {

			// TODO: All types of children should be equal. Add checking logic here.

			this.data[id].children.forEach((childId, order) => {
				this[this.data[childId].type](tid, tbody, childId, depth, order, 0, false);
			});
		}
	}

	tableRowHeader(tid, tbody, id, depth, row, col, isFirstChild) {
		if (!isFirstChild) {
			var tr = document.createElement("tr");
			tbody.appendChild(tr);
			row = tbody.children.length - 1;
		}

		var td = document.createElement("td");
		td.id = "uuid-" + id;
		td.innerHTML = this.data[id].content;
		td.classList.add("header");
		tbody.children[row].appendChild(td);
		
		if (this.data[id].action) this.setAction(td, id);

		td.setAttribute("row", row);
		td.setAttribute("col", col);

		var prop = this.extra[tid].properties;
		if (prop) {
			if (prop.alignment) td.classList.add(prop.alignment[col]);
			if (prop.fitWidth && prop.fitWidth[col]) td.classList.add("fit-width");
		}

		if (this.data[id].children) {

			// TODO: All types of children should be equal. Add checking logic here.

			var total = 0;
			this.data[id].children.forEach((childId, order) => {
				var colspan = 0;
				if (this.data[childId].type !== "tableRowHeader") {
					colspan = depth - col;
					td.setAttribute("colspan", colspan);
				}
				var rows = this[this.data[childId].type](tid, tbody, childId, depth, row, col + (colspan ? colspan : 1), order === 0);
				row += rows;
				total += rows;
			});
			if (total > 1) td.setAttribute("rowspan", total);
			return total;
		} else return 1;
	}

	tableRow(tid, tbody, id, depth, row, col, isFirstChild) {
		if (!isFirstChild) {
			var tr = document.createElement("tr");
			tbody.appendChild(tr);
		}

		if (this.data[id].children) {
			this.data[id].children.forEach((childId, order) => {
				if (this.data[childId].type === "tableCell")
					this.tableCell(tid, tbody, childId, row, col + order);
			});
		}
		return 1;
	}

	tableCell(tid, tbody, id, row, col) {
		var td = document.createElement("td");
		td.id = "uuid-" + id;
		tbody.children[row].appendChild(td);

		if (this.data[id].action) this.setAction(td, id);
		if (this.data[id].highlight) {
			var text = this.data[id].content.replace(/\s*\([^)]*\)\s*/g, "");
			td.innerHTML = this.data[id].content.substring(text.length);
			var highlight = document.createElement("strong");
			highlight.innerHTML = text;
			td.prepend(highlight);
		} else td.innerHTML = this.data[id].content;

		td.setAttribute("row", row);
		td.setAttribute("col", col);

		var prop = this.extra[tid].properties;
		if (prop) {
			if (prop.alignment) td.classList.add(prop.alignment[col]);
			if (prop.fitWidth && prop.fitWidth[col]) td.classList.add("fit-width");
		}
	}

	tableFooter(tid, tfoot, id) {
		// TODO: 
	}

	sortObjIds(arr, options) {
		if (!options || !Array.isArray(options) || !options.length) return;
		arr.sort((a, b) => {
			var compare = 0;
			for (var i = 0; i < options.length && compare == 0; i++) {
				var key = options[i].key;
				var order = options[i].order;
				order = (!order) ? 0 : (order === "ascending" ? 1 : -1);
				if (!order) continue;
				var value1 = this.data[a].content[key];
				var value2 = this.data[b].content[key];
				compare = (value1 === value2) ? 0 : (value1 > value2 ? 1 : -1) * order;
			}
			return compare;
		});
	}

	spreadsheet(parent, id) {
		var ssObj = this.data[id];
		if (!ssObj.content.header || !ssObj.content.body) return;

		var properties = (ssObj.properties && this.data[ssObj.properties].content) ? this.data[ssObj.properties].content : {};
		if (!this.extra.hasOwnProperty(id)) {
			this.extra[id] = {};
			this.extra[id].properties = properties;
		}
		var extra = this.extra[id];

		var table = document.createElement("table");
		table.id = "uuid-" + id;
		table.classList.add("spreadsheet");
		parent.appendChild(table);

		// Get columns info
		if (!extra.hasOwnProperty("columns")) {
			extra.columns = [];
			this.data[ssObj.content.header].children.forEach(key => {
				extra.columns.push({
					id: key,
					key: this.data[key].content
				});
			});
		}

		// Generate spreadsheet data object
		if (!extra.hasOwnProperty("data")) {
			extra.data = [];
			this.data[ssObj.content.body].children.forEach(childId => {
				extra.data.push(childId);
			});
		}
		
		// Sort spreadsheet data by multiple criteria
		var prop = extra.properties;
		if (prop && prop.sort) {
			var sortOptions = [];
			for (const column of extra.columns) {
				sortOptions.push({
					"key": column.key,
					"order": prop.sort[column.key]
				});
			}
			this.sortObjIds(extra.data, sortOptions);
		}

		// Generate mask for data filtering
		if (!extra.hasOwnProperty("mask")) {
			extra.mask = [];
			for (var i = 0; i < extra.data.length; i++) {
				extra.mask.push(new Array(extra.columns.length));
				for (var j = 0; j < extra.columns.length; j++)
					extra.mask[i][j] = 1;
			}
		}

		// Generate filter for auto completion of header
		if (!extra.hasOwnProperty("filters")) {
			extra.filters = {};
			for (const column of extra.columns) extra.filters[column.key] = [];
		}

		// WARNING: The order of function calls should be bottom-up way.
		if (ssObj.content && ssObj.content.footer) {
			this.spreadsheetFooter(id, table, ssObj.content.footer);
		}
		if (ssObj.content && ssObj.content.body) {
			this.spreadsheetBody(id, table, ssObj.content.body);
		}
		if (ssObj.content && ssObj.content.header) {
			this.spreadsheetHeader(id, table, ssObj.content.header);
		}
	}

	spreadsheetHeader(ssid, parent, id) {
		var thead = document.createElement("thead");
		parent.appendChild(thead);
		var tr = document.createElement("tr");
		thead.appendChild(tr);
		if (this.data[id].children) {

			// TODO: All types of children should be equal. Add checking logic here.

			this.data[id].children.forEach((childId, order) => {
				if (this.data[childId].type === "spreadsheetKey")
					this.spreadsheetKey(ssid, tr, childId, order);
			});

			// Set default value
			var prop = this.extra[ssid].properties;
			var comboboxes = parent.querySelectorAll(".filter-combobox");
			if (comboboxes.length) {
				this.data[id].children.forEach((childId, order) => {
					var key = this.data[childId].content;
					if (prop.defaultFilter[key]) {
						comboboxes[order].value = prop.defaultFilter[key];
						comboboxes[order].dispatchEvent(new Event("change"));
					}
				});
			}
		}
	}

	spreadsheetKey(ssid, tr, id, col) {
		var th = document.createElement("th");
		th.id = "uuid-" + id;
		th.setAttribute("row", 0);
		th.setAttribute("col", col);
		tr.appendChild(th);

		var combobox = document.createElement("input");
		combobox.type = "text";
		combobox.id = "combobox-" + id;
		combobox.className = "filter-combobox";
		combobox.title = this.data[id].content;
		combobox.placeholder = this.data[id].content;
		combobox.setAttribute("ssid", ssid);
		combobox.setAttribute("list", "datalist-" + id);
		combobox.setAttribute("col", col);
		combobox.addEventListener("keydown", (e) => {
			e.stopPropagation();
			if (e.key === "Escape") {
				e.target.value = "";
				e.target.dispatchEvent(new Event("change"));
			}
		});
		combobox.addEventListener("change", (e) => {
			var ssid = e.target.getAttribute("ssid");
			var input = e.target.value;

			var table = document.querySelector("#uuid-" + ssid);
			var tfootRow = table.querySelector("tfoot > tr");
			var rows = table.querySelector("tbody").querySelectorAll("tr");
			var col = parseInt(e.target.getAttribute("col"));

			// Reset masking
			var mask = this.extra[ssid].mask;
			Array.from(rows).forEach((tr, row) => {
				mask[row][col] = 1;
			});

			// Masking
			if (input.length) {
				if (input.toLowerCase() === "(empty)") {
					Array.from(rows).forEach(function (tr, row) {
						if (tr.childNodes[col].innerText.length)
							mask[row][col] = 0;
					});
				} else {
					Array.from(rows).forEach(function (tr, row) {
						if (tr.childNodes[col].innerText !== input)
							mask[row][col] = 0;
					});
				}
			}

			// Initiate column statistics
			var footerId = this.data[ssid].content.footer;
			if (footerId && this.data[footerId].children && tfootRow) {
				// Remove all children of `<table><tfoot><tr>`
				while (tfootRow.lastChild) tfootRow.removeChild(tfootRow.lastChild);

				// Update statistics
				this.data[footerId].children.forEach((childId, order) => {
					if (this.data[childId].type === "spreadsheetStats")
						this.spreadsheetStats(ssid, tfootRow, childId, order);
				});
			}

			// Update filter
			var filters = this.extra[ssid].filters;
			Object.keys(filters).forEach(key => { filters[key] = []; });

			// Hide filtered rows
			Array.from(rows).forEach((tr, row) => {
				// Do filtering by mask
				if (mask[row].reduce((a, b) => { return a * b; })) {
					tr.classList.remove("hidden");

					var id = this.extra[ssid].data[row];
					this.extra[ssid].columns.forEach(column => {
						var filterValue = this.data[id].content[column.key];
						filterValue = (filterValue || filterValue === 0) ? filterValue : "(empty)";
						if (!filters[column.key].includes(filterValue)) filters[column.key].push(filterValue);
					});
				} else {
					tr.classList.add("hidden");
				}
			});

			// Sort filter's suggestion list
			var prop = this.extra[ssid].properties;
			Object.keys(filters).forEach(key => {
				filters[key].sort(function (a, b) {
					var order = prop.sort[key];
					order = (!order || order === "none") ? 0 : (order === "ascending" ? 1 : -1);
					return a == b ? 0 : (a > b ? 1 : -1) * order;
				});
			});

			// Add options to datalist
			this.extra[ssid].columns.forEach((column, order) => {
				var datalist = document.querySelector("#datalist-" + column.id);
				while (datalist.lastChild) datalist.removeChild(datalist.lastChild);
				this.extra[ssid].filters[column.key].forEach(data => {
					var option = document.createElement("option");
					option.value = data;
					option.innerHTML = data;
					datalist.appendChild(option);
				});
			});
			e.target.blur();
		});
		th.appendChild(combobox);

		// Datalist
		var datalist = document.createElement("datalist");
		datalist.id = "datalist-" + id;
		th.appendChild(datalist);
		this.extra[ssid].filters[this.data[id].content].forEach(data => {
			var option = document.createElement("option");
			option.value = data;
			option.innerHTML = data;
			datalist.appendChild(option);
		});
	}

	spreadsheetBody(ssid, parent, id) {
		var tbody = document.createElement("tbody");
		tbody.id = "uuid-" + id;
		tbody.style.setProperty("--counterId", tbody.id);
		parent.appendChild(tbody);

		this.extra[ssid].data.forEach((childId, order) => {
			if (this.data[childId].type === "spreadsheetData")
				this.spreadsheetData(ssid, tbody, childId);
		});

		// Sort filter's suggestion list
		var filters = this.extra[ssid].filters;
		var prop = this.extra[ssid].properties;
		Object.keys(filters).forEach(key => {
			filters[key].sort(function (a, b) {
				var order = prop.sort[key];
				order = (!order || order === "none") ? 0 : (order === "ascending" ? 1 : -1);
				return a == b ? 0 : (a > b ? 1 : -1) * order;
			});
		});
	}

	spreadsheetData(ssid, tbody, id) {
		var tr = document.createElement("tr");
		tr.id = "uuid-" + id;
		tr.style.setProperty("--counterId", tbody.id);
		tbody.appendChild(tr);

		var extra = this.extra[ssid];
		var filters = extra.filters;
		var alignment = extra.properties.alignment;
		var dataType = extra.properties.dataType;

		var data = this.data[id].content;
		for (const column of extra.columns) {
			var key = column.key;
			var td = document.createElement("td");
			if (dataType[key] === "number" || dataType[key] === "price") {
				if (!data[key]) {
					td.innerHTML = 0;
				} else {
					if (dataType[key] === "price") td.innerHTML = data[key].toLocaleString();
					else td.innerHTML = data[key];
				}
			} else {
				if (data[key]) td.innerHTML = data[key];
				else td.innerHTML = "";
			}
			if (alignment) td.classList.add(alignment[key]);
			tr.appendChild(td);

			// Make filter for each key
			var filterValue = (data[key] || data[key] === 0) ? data[key] : "(empty)";
			if (!filters[key].includes(filterValue)) filters[key].push(filterValue);
		}
	}

	spreadsheetFooter(ssid, parent, id) {
		var tfoot = document.createElement("tfoot");
		parent.appendChild(tfoot);
		var tr = document.createElement("tr");
		tfoot.appendChild(tr);

		if (this.data[id].children) {
			// Reset statistics
			if (!this.extra[ssid].hasOwnProperty("stats")) {
				this.extra[ssid].stats = {};
				this.extra[ssid].stats.type = {};
				this.extra[ssid].stats.value = {};
			}

			// Get column statistics
			this.data[id].children.forEach((childId, order) => {
				if (this.data[childId].type === "spreadsheetStats")
					this.spreadsheetStats(ssid, tr, childId, order);
			});
		}
	}

	spreadsheetStats(ssid, parent, id, col) {
		var td = document.createElement("td");
		td.id = "uuid-" + id;
		td.setAttribute("row", 0);
		td.setAttribute("col", col);
		td.classList.add("center");
		parent.appendChild(td);

		var content = this.data[id].content;
		var contentType = this.data[id].contentType;

		if (content) {
			td.innerHTML = content;
		} else if (contentType) {
			var key = this.extra[ssid].columns[col].key;
			var statsValue = this.extra[ssid].stats.value[key];

			this.extra[ssid].stats.type[key] = contentType;
			if (contentType === "total") statsValue = 0;
			else if (contentType === "variety") statsValue = [];
			else if (contentType === "count") statsValue = 0;
			else statsValue = "";

			// Get statistics
			var mask = this.extra[ssid].mask;
			this.extra[ssid].data.forEach((childId, order) => {
				if (mask[order].reduce((a, b) => { return a * b; })) {
					var value = this.data[childId].content[key];
					if (contentType === "total") statsValue += value;
					else if (contentType === "variety") { if (!statsValue.includes(value)) statsValue.push(value); }
					else if (contentType === "count") statsValue += 1;
				}
			});

			// Update footer's value
			if (contentType === "variety" && statsValue.length) {
				td.innerHTML = statsValue.length.toLocaleString() + (statsValue.length === 1 ? " value" : " values");
			} else if (contentType === "total") {
				td.innerHTML = "Total: " + statsValue.toLocaleString();
			} else if (contentType === "count") {
				td.innerHTML = "Count: " + statsValue.toLocaleString();
			} else statsValue = "";
		}
	}

	setAction(el, id) {
		el.classList.add("action");
		var actionItems = [];
		for (const [event, action] of Object.entries(this.data[id].action)) {
			if (`${event}` && `${action}`)
				actionItems.push(`${event}` + ":" + `${action}`);

			el.addEventListener(`${event}`, (e) => {
				var actions = e.target.getAttribute("actions").split(",");
				for (var i = 0; i < actions.length; i++) {
					var action = actions[i].split(":");
					if (action[0] === e.type) {
						this.action(this.data[action[1]]);
						break;
					}
				}
			});
		}
		el.setAttribute("actions", actionItems.join(','));
		if (this.data[id].action.hasOwnProperty("click"))
			el.setAttribute("title", this.data[this.data[id].action.click].content);
	}

	action(action) {
		if (action.type !== "action") return;

		var contentType = action.contentType || "text/plain; charset=utf-8";
		if (contentType === "url") {
			window.open(action.content);
		} else if (contentType === "local") {
			(new Function(action.content))();
		} else {
			// Open encrypted file
			var xhr = new XMLHttpRequest();
			xhr.open("GET", action.content);
			xhr.onreadystatechange = function (e) {
				if (xhr.readyState === 4 && xhr.status === 200) {
					try {
						// var ui8a = new Uint8Array(xhr.response);
						var decrypted = CryptoJS.AES.decrypt(xhr.responseText, sessionStorage.getItem("passphrase"));
						var arr = decrypted.hasOwnProperty("words") ? decrypted.words : [];
						var len = decrypted.hasOwnProperty("sigBytes") ? decrypted.sigBytes : decrypted.length * 4;
						var ui8a = new Uint8Array(len);
						var offset = 0;
						for (var i = 0; i < len; i++) {
							ui8a[offset++] = arr[i] >> 24;
							ui8a[offset++] = (arr[i] >> 16) & 0xff;
							ui8a[offset++] = (arr[i] >> 8) & 0xff;
							ui8a[offset++] = arr[i] & 0xff;
						}
						var blob = new Blob([ui8a], { type: contentType });
						var blobUrl = URL.createObjectURL(blob);
						var a = document.createElement("a");
						a.href = blobUrl;
						a.target = "_blank";
						a.click();
						URL.revokeObjectURL(blobUrl);
					} catch (e) {
						alert(e);
					}
				}
			};
			xhr.send();
		}
	}
}
