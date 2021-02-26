let DataViewer = (function () {
	let _viewer = null;
	let _headings = [];
	let _getUniqueHID = function (id) {
		if (!_headings.includes(id)) {
			_headings.push(id);
			return id;
		}
		var regex = new RegExp("^" + id + "-\\d+$");
		var max = 0;
		_headings.forEach(function (hid) {
			if (regex.test(hid)) {
				var tokens = hid.split('-');
				try {
					var n = parseInt(tokens.pop());
					if (n > max) max = n;
				} catch (e) {}
			}
		});
		var newHid = id + "-" + (max + 1);
		_headings.push(newHid);
		return newHid;
	};
	return {
		init: function (el) {
			_viewer = el;
			return _viewer ? true : false;
		},
		getDOM: function () {
			return _viewer;
		},
		clear: function () {
			while (_viewer.firstChild) _viewer.removeChild(_viewer.lastChild);
			_headings = [];
		},
		display: function (objects, level) {
			objects.forEach(function (obj) {
				if (obj.type === "heading") {
					var h = document.createElement("h" + level);
					var hid = obj.data.replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g, "-").toLowerCase();
					h.id = _getUniqueHID(hid);
					h.innerHTML = obj.data;
					_viewer.appendChild(h);
				} else if (obj.type === "paragraph") {
					var p = document.createElement("p");
					p.innerHTML = obj.data;
					_viewer.appendChild(p);
				} else if (obj.type === "list") {
					DataViewer.displayList(obj);
				} else if (obj.type === "ordered") {
					DataViewer.displayOrderedList(obj);
				} else if (obj.type === "table") {
					DataViewer.displayTable(obj);
				} else if (obj.type === "spreadsheet") {
					DataViewer.displaySpreadSheet(obj);
				}
				if (obj.children) DataViewer.display(obj.children, level + 1);
			});
		},
		displayList: function (obj) {
			//
		},
		displayOrderedList: function (obj) {
			//
		},

		/**
		 * Display table.
		 * @param {function(object)} objTable
		 */
		displayTable: function (objTable) {
			// Create DOM objects
			var table = document.createElement("table");
			_viewer.appendChild(table);
			var thead = document.createElement("thead");
			table.appendChild(thead);
			var trHeader = document.createElement("tr");
			thead.appendChild(trHeader);
			var tbody = document.createElement("tbody");
			table.appendChild(tbody);

			// Table column header check
			if (!objTable.columnHeaders) {
				var th = document.createElement("th");
				th.innerHTML = "WARNING!";
				trHeader.appendChild(th);
				var trBody = document.createElement("tr");
				tbody.appendChild(trBody);
				var td = document.createElement("td");
				td.innerHTML = "Incomplete Data: No header...";
				trBody.appendChild(td);
				return;
			}

			// Display table header
			if (objTable.headerRow) {
				for (var i = 0; i < objTable.columnHeaders.length; i++) {
					var header = objTable.columnHeaders[i];
					if (header.name) {
						var th = document.createElement("th");
						th.innerHTML = header.name;
						th.classList.add("center");
						if (header.fitWidth) th.classList.add("fit-width");
						trHeader.appendChild(th);
					} else {
						if (trHeader.lastChild) {
							var colspan = trHeader.lastChild.getAttribute("colspan");
							if (colspan) colspan = parseInt(colspan);
							else colspan = 2;
							trHeader.lastChild.setAttribute("colspan", colspan);
						}
					}
				}
			}

			function insertCell(obj, tr, isFirstChild, col) {
				if (!tr || !isFirstChild) {
					tr = document.createElement("tr");
					tbody.appendChild(tr);
				}

				var td = tr.lastChild;
				if (obj.data) {
					td = document.createElement("td");
					if (obj.link) {
						var a = document.createElement("a");
						a.href = "javascript:;";
						a.innerHTML = obj.data;
						a.title = obj.link;
						a.addEventListener("click", function () {
							if (obj.linkType.toLowerCase() === "url") window.open(obj.link);
							else openEncryptedFile(obj.link, obj.linkType);
						});
						td.appendChild(a);
					} else if (obj.highlight) {
						var text = obj.data.replace(/\s*\([^)]*\)\s*/g, "");
						td.innerHTML = obj.data.substring(text.length);
						var highlight = document.createElement("strong");
						highlight.innerHTML = text;
						td.prepend(highlight);
					} else td.innerHTML = obj.data;
					if (objTable.columnHeaders && objTable.columnHeaders[col].alignment)
						td.classList.add(objTable.columnHeaders[col].alignment);
					if (obj.isFieldHeader)
						td.classList.add("header");
					if (objTable.columnHeaders[col].fitWidth)
						td.classList.add("fit-width");
					tr.appendChild(td);
				} else {
					if (!td) td = document.createElement("td");
					var colspan = td.getAttribute("colspan");
					colspan = colspan ? parseInt(colspan) + 1 : 2;
					td.setAttribute("colspan", colspan);
				}

				var rows = (obj.children && obj.children.length) ? 0 : 1;
				if (obj.children) {
					obj.children.forEach(function (childObj, idx) {
						rows += insertCell(childObj, tr, idx === 0, col + 1);
					});
				}
				if (rows > 1) td.setAttribute("rowspan", rows);
				return rows;
			}

			// Display table body
			objTable.data.forEach(function (record, idx) {
				insertCell(record, null, idx === 0, 0);
			});
		},

		/**
		 * Display spreadsheet which contains both header and footer.
		 * @param {function(object)} objSpreadSheet 
		 */
		displaySpreadSheet: function (objSpreadSheet) {
			// Create DOM objects
			var table = document.createElement("table");
			_viewer.appendChild(table);
			var thead = document.createElement("thead");
			table.appendChild(thead);
			var trHeader = document.createElement("tr");
			thead.appendChild(trHeader);
			var tbody = document.createElement("tbody");
			table.appendChild(tbody);
			var tfoot = document.createElement("tfoot");
			table.appendChild(tfoot);
			var trFooter = document.createElement("tr");
			tfoot.appendChild(trFooter);

			// SpreadSheet should have column headers.
			if (!objSpreadSheet.columnHeaders) {
				var th = document.createElement("th");
				th.innerHTML = "WARNING!";
				trHeader.appendChild(th);
				var trBody = document.createElement("tr");
				tbody.appendChild(trBody);
				var td = document.createElement("td");
				td.innerHTML = "Incomplete Data: No header...";
				trBody.appendChild(td);
				return;
			}

			// Sort data by multiple keys
			objSpreadSheet.data.msort(objSpreadSheet.columnHeaders);

			// Generate mask for filtering
			objSpreadSheet.mask = [];
			for (var i = 0; i < objSpreadSheet.data.length; i++) {
				objSpreadSheet.mask.push(new Array(objSpreadSheet.columnHeaders.length));
				for (var j = 0; j < objSpreadSheet.columnHeaders.length; j++) objSpreadSheet.mask[i][j] = 1;
			}

			// Display spreadsheet body
			var filters = {};
			objSpreadSheet.data.forEach(function (record) {
				var trRecord = document.createElement("tr");
				tbody.appendChild(trRecord);

				// No.
				var tdRowNo = document.createElement("td");
				tdRowNo.classList.add("header", "right");
				trRecord.appendChild(tdRowNo);

				// Row data
				objSpreadSheet.columnHeaders.forEach(function (header) {
					var td = document.createElement("td");
					td.innerHTML = (typeof record[header.name] === "number" && header.type === "price") ? record[header.name].toLocaleString() : record[header.name];
					if (header.alignment) td.classList.add(header.alignment);
					trRecord.appendChild(td);

					// Make filter
					if (!filters.hasOwnProperty(header.name))
						filters[header.name] = [];
					if (!filters[header.name].includes(record[header.name]))
						filters[header.name].push(record[header.name]);
				});
			});

			// Sort header's suggestion list with the given order
			Object.keys(filters).forEach(function (key) {
				filters[key].sort(function (a, b) {
					for (var i = 0; i < objSpreadSheet.columnHeaders.length; i++) {
						if (objSpreadSheet.columnHeaders[i].name == key) {
							var order = objSpreadSheet.columnHeaders[i].sort;
							order = (!order || order === "none") ? 0 : (order === "descending" ? -1 : 1);
							return a == b ? 0 : (a > b ? 1 : -1) * order;
						}
					}
					return 0;
				});
			});

			// Display spreadsheet header
			var thNo = document.createElement("th");
			thNo.className = "fit-width";
			thNo.innerHTML = "No.";
			trHeader.appendChild(thNo);
			for (var i = 0; i < objSpreadSheet.columnHeaders.length; i++) {
				var header = objSpreadSheet.columnHeaders[i];

				// Insert cell into the header row
				var th = document.createElement("th");
				trHeader.appendChild(th);

				var combobox = document.createElement("input");
				combobox.type = "text";
				combobox.id = "private-combobox-" + objSpreadSheet.name + "-" + header.name;
				combobox.className = "tablecell-combobox";
				combobox.title = header.name;
				combobox.placeholder = header.name;
				combobox.setAttribute("list", "private-combo-" + objSpreadSheet.name + "-" + header.name);
				combobox.setAttribute("column", i);
				combobox.addEventListener("keydown", function (e) {
					e.stopPropagation();
					if (e.code === "Escape") {
						this.value = "";
						this.dispatchEvent(new Event("change"));
					}
				});
				combobox.addEventListener("change", function () {
					var table = this.getAncestorByTagName("table");
					var rows = table.querySelector("tbody").querySelectorAll("tr");
					var colIdx = this.getAttribute("column");
					var input = this.value;

					// Footer data
					var footer = {};
					for (var i = 0; i < objSpreadSheet.columnHeaders.length; i++) {
						var header = objSpreadSheet.columnHeaders[i];
						if (header.footerType === "total") footer[header.name] = 0;
						else footer[header.name] = [];
					}

					// Reset masking
					Array.from(rows).forEach(function (row, rowIdx) {
						objSpreadSheet.mask[rowIdx][colIdx] = 1;
					});

					// Masking
					if (input) {
						Array.from(rows).forEach(function (row, rowIdx) {
							if (row.childNodes[parseInt(colIdx)+1].innerText != input)
								objSpreadSheet.mask[rowIdx][colIdx] = 0;
						});
					}
					var count = 1;
					Array.from(rows).forEach(function (row, rowIdx) {
						if (objSpreadSheet.mask[rowIdx].reduce(function (a, b) { return a * b; })) {
							row.classList.remove("hidden");
							row.childNodes[0].innerHTML = count++;
							for (var i = 0; i < objSpreadSheet.columnHeaders.length; i++) {
								var header = objSpreadSheet.columnHeaders[i];
								var value = objSpreadSheet.data[rowIdx][header.name];
								if (value) {
									if (header.footerType && header.footerType === "total") {
										footer[header.name] += value;
									} else {
										if (!footer[header.name].includes(value))
											footer[header.name].push(value);
									}
								}
							}
						} else {
							row.classList.add("hidden");
						}
					});

					// Display footer
					trFooter.innerHTML = "";
					var tf = document.createElement("td");
					trFooter.appendChild(tf);
					for (var i = 0; i < objSpreadSheet.columnHeaders.length; i++) {
						var header = objSpreadSheet.columnHeaders[i];
						var td = document.createElement("td");
						td.classList.add("center");
						trFooter.appendChild(td);

						if (header.footerType === "variety" && footer[header.name].length)
							td.innerHTML = footer[header.name].length.toLocaleString() + " values";
						else if (header.footerType === "total")
							td.innerHTML = "Total: " + footer[header.name].toLocaleString();
					}
				});
				th.appendChild(combobox);
				var datalist = document.createElement("datalist");
				datalist.id = "private-combo-" + objSpreadSheet.name + "-" + header.name;
				filters[header.name].forEach(function (value) {
					var option = document.createElement("option");
					option.value = value;
					option.innerHTML = value;
					datalist.appendChild(option);
				});
				th.appendChild(datalist);
			}

			// Set default value
			var comboboxes = table.querySelectorAll(".tablecell-combobox");
			if (comboboxes.length) {
				for (var i = 0; i < objSpreadSheet.columnHeaders.length; i++) {
					var header = objSpreadSheet.columnHeaders[i];
					if (header.hasOwnProperty("initValue"))
						comboboxes[i].value = header.initValue;
				}
				comboboxes[0].dispatchEvent(new Event("change"));
			}
		}
	};
})();