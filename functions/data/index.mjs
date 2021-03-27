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
			{
				const newUuid = document.querySelector("#id-5nbkkGt7ynI5Oo1NcBH6FJ");
				newUuid.addEventListener("focus", e => {
					e.target.select();
				});
				const btnGenerateNew = document.querySelector("#id-0W4rZ284okFhNi3wEwsRdO");
				btnGenerateNew.addEventListener("click", e => {
					const input = document.querySelector("#id-5nbkkGt7ynI5Oo1NcBH6FJ");
					input.value = uuid();
				});
				btnGenerateNew.click();
				const btnCopyToClipboard = document.querySelector("#id-0Cv5QSHRMtLp05bV0WAHoF");
				btnCopyToClipboard.addEventListener("click", e => {
					const input = document.querySelector("#id-5nbkkGt7ynI5Oo1NcBH6FJ");
					navigator.clipboard.writeText(input.value).then(() => {
						// Do nothing
					}, (e) => {
						console.error("Could not copy text: ", e);
					});
				});
			}
			{
				const curEntityId = document.querySelector("#id-2iB1fu5I8X0uE71RUNXjkV");
				curEntityId.addEventListener("keydown", (e) => {
					e.stopPropagation();
					if (e.key === "Escape") { e.target.value = ""; }
				});
				curEntityId.addEventListener("keypress", (e) => {
					// Prevent from auto focusing on search input
					e.stopPropagation();
				});
				curEntityId.addEventListener("focus", e => {
					e.target.select();
				});
				curEntityId.addEventListener("change", (e) => {
					const entityView = document.querySelector("#id-1ilMellLqQg27kkGPQVFmG");
					let entity = sectional.getEntity(e.target.value);
					if (entity && e.target.value.length === 22) {
						entityView.value = JSON.stringify(entity, null, 4);
					} else entityView.value = "";
				});
			}
			{
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
					let templateView = document.querySelector("#id-1Stir8sO6QnPpV8xcyimeG");
					templateView.value = `${uuid(true)}: ${JSON.stringify(Entity.Template(e.target.value), null, 4)}`;
				});
			}
		}).catch(e => {
			console.error(e);
		});

		initialized = true;
	}
}
