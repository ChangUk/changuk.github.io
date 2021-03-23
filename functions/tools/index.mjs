import { ShortUuidV4 } from "/assets/lib/short-uuidv4/1.0.1/short-uuidv4.js";
import { checkSession } from "/private/private.mjs"
import { Entity } from "/assets/lib/sectional/1.0.0/entity.js";

let uuid = (quotation = false) => {
	let newUuid = new ShortUuidV4().new();
	return quotation ? `"${newUuid}"` : newUuid;
};

export default function () {
	let url = new URL(window.location);
	if (url.pathname === "/private/" && checkSession()) {
		let privatePage = document.querySelector("#private-page");
		if (privatePage.classList.contains("open-tools")) {
			privatePage.classList.remove("open-tools");
			document.querySelector("#search-input").focus();
		} else {
			privatePage.classList.add("open-tools");
			document.querySelector("#private-tools-entity-id").focus();
		}

		import("/private/private.mjs").then(({ sectional }) => {
			// Initialization
			let btnClose = document.querySelector("#private-tools-close");
			btnClose.addEventListener("click", (e) => {
				import(import.meta.url)
					.then(mod => {
						mod.default();
					}).catch(err => {
					});
			});
			let entityTypes = document.querySelector("#private-tools-entity-types");
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
							let entityId = document.querySelector("#private-tools-entity-id");
							entityId.value = match[0];
							entityId.dispatchEvent(new Event("change"));
						}
						else getElId(el.parentNode);
					} else getElId(el.parentNode);
				}
				getElId(e.target);
			});

			let entityId = document.querySelector("#private-tools-entity-id");
			entityId.addEventListener("keydown", (e) => {
				e.stopPropagation();
				if (e.key === "Escape") { e.target.value = ""; }
			});
			entityId.addEventListener("keypress", (e) => {
				// Prevent from auto focusing on search input
				e.stopPropagation();
			});
			entityId.addEventListener("change", (e) => {
				let entityView = document.querySelector("#private-tools-entity-view");
				let entity = sectional.getEntity(e.target.value);
				if (entity && e.target.value.length === 22) {
					entityView.value = JSON.stringify(entity, null, 4);
				} else entityView.value = "";
			});

			let combobox = document.querySelector("#private-tools-entity-type");
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
				let templateView = document.querySelector("#private-tools-entity-template");
				templateView.value = `${uuid(true)}: ${JSON.stringify(Entity.Template(e.target.value), null, 4)}`;
			});
		}).catch(e => {
			console.error(e);
		});
	}
}
