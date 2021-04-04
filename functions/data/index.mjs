import { ShortUuidV4 } from "/assets/lib/short-uuidv4/1.0.1/short-uuidv4.js";
import { checkSession, exportData } from "/private/private.mjs"
import { Entity } from "/assets/lib/sectional/1.0.0/entity.js";

const uuid = (quotation = false) => {
	let newUuid = new ShortUuidV4().new();
	return quotation ? `"${newUuid}"` : newUuid;
};

let initialized = false;

export default function () {
	const url = new URL(window.location);
	if (url.pathname === "/private/" && checkSession()) {
		const privatePage = document.querySelector("#private-page");
		if (privatePage.classList.contains("open-manager")) privatePage.classList.remove("open-manager");
		else privatePage.classList.add("open-manager");
		document.querySelector("#search-input").focus();

		if (initialized) return;

		import("/private/private.mjs").then(({ sectional }) => {
			// Initialization
			let btnClose = document.querySelector("#id-21cIRHGf0zjwRNUMZye2F8");
			btnClose.addEventListener("click", (e) => {
				import(import.meta.url)
					.then(mod => {
						mod.default();
					}).catch(err => {
					});
			});
			let entityTypes = document.querySelector("#id-00q3kS1yS9sr0REdzzkDlw");
			while (entityTypes.lastChild) entityTypes.removeChild(entityTypes.lastChild);
			Object.keys(Entity.TEMPLATE).sort().forEach((entityType) => {
				let option = document.createElement("option");
				option.value = entityType;
				entityTypes.appendChild(option);
			});
			document.addEventListener("contextmenu", (e) => {
				e.preventDefault();
				function getElId(el) {
					if (!el) return;
					let id = el.id;
					if (id && /^stnl-[a-zA-Z0-9]{22}/.exec(id)) {
						let match = id.replace(/^stnl-/g, "").match(/\b[a-zA-Z0-9]{22}\b/);
						if (match && match[0]) {
							let entityId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
							entityId.value = match[0];
							entityId.dispatchEvent(new Event("change"));
						}
						else getElId(el.parentNode);
					} else getElId(el.parentNode);
				}
				getElId(e.target);
			});
			{
				const btnExport = document.querySelector("#id-3rTZdFdxjcWXsrIpFFkaTj");
				btnExport.addEventListener("click", e => {
					let result = confirm("Are you sure to export private data?");
					if (result) exportData();
				});
			}
			{ // Entity Editor
				const checkIdFormat = (value) => {
					const input = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
					if (/^[a-zA-Z0-9]{22}$/.exec(value) || !value.length) {
						input.classList.remove("invalid-value");
						return true;
					} else {
						input.classList.add("invalid-value");
						return false;
					}
				}
				const checkEntityContent = (value) => {
					const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
					if (!value.length) {
						entityContent.classList.remove("invalid-value");
						return true;
					}
					try {
						JSON.parse(value);
						entityContent.classList.remove("invalid-value");
						return true;
					} catch (err) {
						entityContent.classList.add("invalid-value");
						return false;
					}
				}

				const entityId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
				entityId.addEventListener("keydown", (e) => {
					e.stopPropagation();
					if (e.key === "Escape") { e.target.value = ""; }
				});
				entityId.addEventListener("keypress", (e) => {
					// Prevent from auto focusing on search input
					e.stopPropagation();
				});
				entityId.addEventListener("focus", (e) => {
					e.target.select();
				});
				entityId.addEventListener("input", (e) => {
					checkIdFormat(e.target.value);
				});
				entityId.addEventListener("change", (e) => {
					checkIdFormat(e.target.value);
					const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
					let entity = sectional.getEntity(e.target.value);
					if (entity && e.target.value.length === 22) {
						const ordered = Object.keys(entity).sort().reduce(
							(obj, key) => {
								obj[key] = entity[key];
								return obj;
							},
							{}
						);
						entityContent.value = JSON.stringify(ordered, null, 4);
					} else entityContent.value = "";
					entityContent.dispatchEvent(new Event("change"));
				});

				const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
				entityContent.addEventListener("keydown", (e) => {
					e.stopPropagation();
				});
				entityContent.addEventListener("keypress", (e) => {
					e.stopPropagation();
				});
				entityContent.addEventListener("input", (e) => {
					e.stopPropagation();
				});
				entityContent.addEventListener("change", (e) => {
					checkEntityContent(e.target.value);
				});

				const btnReset = document.querySelector("#id-3F5CVe3tnFadXKSNxNDJYA");
				btnReset.addEventListener("click", (e) => {
					const curId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
					curId.value = "";
					curId.dispatchEvent(new Event("change"));
				});

				const btnNewId = document.querySelector("#id-0W4rZ284okFhNi3wEwsRdO");
				btnNewId.addEventListener("click", e => {
					const curId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
					curId.value = uuid();
				});

				const btnSave = document.querySelector("#id-2QEfF3VjOq5mStkqEMaFRO");
				btnSave.addEventListener("click", (e) => {
					const curId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
					if (!checkIdFormat(curId.value)) {
						alert("Invalid Entity ID format!");
						return;
					}
					const entityContent = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
					if (!checkEntityContent(entityContent.value)) {
						alert("Invalid JSON format!");
						return;
					}
					if (curId.value.length && entityContent.value.length) {
						let res = false;
						if (sectional.getEntity(curId.value)) res = confirm("The given entity ID is existing.\nAre you sure to overwrite?");
						else res = confirm("Are you sure to save entity?");
						if (res) {
							try {
								let result = sectional.setEntity(curId.value, JSON.parse(entityContent.value));
								if (result) alert("Successfully saved!");
								else alert("Failed to save entity!");
							} catch (err) {
								alert(`Failed to save entity: ${err}`);
							}
						}
					}
				});

				const btnRemove = document.querySelector("#id-1Q5TS3PdxDME4YF92Rayl0");
				btnRemove.addEventListener("click", (e) => {
					const curId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
					if (!checkIdFormat(curId.value)) {
						alert("Invalid Entity ID format!");
						return;
					}
					if (curId.value.length) {
						if (sectional.getEntity(curId.value)) {
							if (confirm("Are you sure to delete entity?")) {
								let result = sectional.removeEntity(curId.value);
								if (result) alert("Successfully removed!");
								else alert("Failed to remove entity!");
							}
						} else {
							alert("Not found the given entity ID!");
							return;
						}
					}
				});
			}
			{ // Entity Template
				const combobox = document.querySelector("#id-6kYDDAzRbke7m1Rb1Rvqkp");
				combobox.addEventListener("keydown", (e) => {
					e.stopPropagation();
					if (e.key === "Escape") {
						e.target.value = "";
						// e.target.dispatchEvent(new Event("input"));
					}
				});
				combobox.addEventListener("keypress", (e) => {
					// Prevent from auto focusing on search input
					e.stopPropagation();
				});
				combobox.addEventListener("input", (e) => {
					e.stopPropagation();
				});
				combobox.addEventListener("change", (e) => {
					if (!e.target.value) return;
					const textarea = document.querySelector("#id-1Stir8sO6QnPpV8xcyimeG");
					let template = Entity.Template(e.target.value);
					const ordered = Object.keys(template).sort().reduce(
						(obj, key) => {
							obj[key] = template[key];
							return obj;
						},
						{}
					);
					textarea.value = JSON.stringify(ordered, null, 4);
				});

				const btnReset = document.querySelector("#id-3597Oai8C2I4bKXVQShv50");
				btnReset.addEventListener("click", (e) => {
					const combobox = document.querySelector("#id-6kYDDAzRbke7m1Rb1Rvqkp");
					combobox.value = "";
					combobox.dispatchEvent(new Event("change"));
					const template = document.querySelector("#id-1Stir8sO6QnPpV8xcyimeG");
					template.value = "";
				});

				const btnCopyTemplate = document.querySelector("#id-5sBvAZMWtngtuHx0SPEwKM");
				btnCopyTemplate.addEventListener("click", (e) => {
					const template = document.querySelector("#id-1Stir8sO6QnPpV8xcyimeG");
					navigator.clipboard.writeText(template.value).then(() => {
						// Do nothing
					}, (e) => {
						console.error("Could not copy text: ", e);
					});
				});
			}
		}).catch(e => {
			console.error(e);
		});

		initialized = true;
	}
}
