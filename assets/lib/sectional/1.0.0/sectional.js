import { LayoutEntity } from "./layoutEntity.js";
export class Sectional {
    constructor(view, json, options) {
        // Options
        this._callback = (e) => { };
        this._insertSections = true;
        this._entry = "0000000000000000000000";
        if (!view || !json)
            throw new Error("Missing parameters!");
        this._viewport = view;
        this._data = json;
        // Set options
        if (options) {
            if ("callback" in options && typeof options.callback === "function")
                this._callback = options.callback;
            if ("insertSections" in options && typeof options.insertSections === "boolean")
                this._insertSections = options.insertSections;
            if ("entry" in options && typeof options.entry === "string")
                this._entry = options.entry;
        }
        const init = (id, parent, depth) => {
            if (!id)
                return;
            // Metadata
            let entity = this._data[id];
            if (!entity)
                throw new Error(`Invalid entity: ${id}`);
            entity._id = id;
            entity._depth = depth;
            if (parent) {
                if (!("_parent" in entity))
                    entity._parent = [];
                entity._parent.push(parent);
            }
            // Iterate through child entities
            if (entity.children) {
                entity.children.forEach((childId) => {
                    init(childId, id, depth + 1);
                });
            }
        };
        init(this._entry, "", 0);
    }
    getEntry() {
        return this._entry;
    }
    importData(data) {
        this._data = data;
    }
    exportData(removeMetadata = true) {
        let deepCopied = JSON.parse(JSON.stringify(this._data));
        if (removeMetadata) {
            Object.keys(deepCopied).forEach((id) => {
                let entity = deepCopied[id];
                for (const key of Object.keys(entity)) {
                    if (key.startsWith('_'))
                        delete entity[key];
                }
            });
        }
        return deepCopied;
    }
    getEntity(id) {
        if (!(id in this._data))
            return null;
        return this._data[id];
    }
    setEntity(id, record) {
        try {
            this._data[id] = record;
            return true;
        }
        catch (e) {
            return false;
        }
    }
    setMetadata() {
        // let reference = (parent: EntityID | null, id: EntityID) => {
        // 	if (!id || id.length !== 22) return;
        // 	if (id in this._data) {
        // 		let entity = this._data[id];
        // 		if (entity) {
        // 			// Metadata
        // 			if (!("_parents" in entity)) entity._parents = new Array<EntityID>();
        // 			if (!entity._parent.contains(parent)) entity._parents.push(parent);
        // 			// Necessary properties
        // 			if (entity.children)
        // 				entity.children.forEach((childId: EntityID) => { reference(id, childId); });
        // 			if ("content" in entity && typeof entity.content === "object")
        // 				Object.keys(entity.content).forEach((key: string) => {
        // 					if (entity.content)
        // 					reference(id, entity.content[key]);
        // 				});
        // 			// Optional properties
        // 			if (entity.classlist)
        // 				reference(id, entity.classlist);
        // 			if (entity.properties)
        // 				reference(id, entity.properties);
        // 			if (entity.action)
        // 				reference(id, entity.action);
        // 		}
        // 	} else console.log(`--- Broken pointer: parent("${parent}") -> target("${id}")"`);
        // }
        // reference(null, this._entry);
    }
    removeEntity(id) {
        if (id && id in this._data) {
            let entity = this._data[id];
            if (entity) {
                if (entity.hasOwnProperty("children")) {
                    let children = entity.children;
                    // TODO: 
                }
            }
            delete this._data[id];
            return true;
        }
        else {
            return false;
        }
    }
    cleanup() {
        // TODO: 
    }
    getArticles() {
        let rootEntity = this._data[this._entry];
        if (rootEntity)
            return rootEntity.children;
        return [];
    }
    article(id) {
        this.clearViewport();
        let entity = new LayoutEntity(id, this._data, this._callback);
        entity.article(id, this._viewport, this._insertSections);
    }
    clearViewport() {
        while (this._viewport.lastChild)
            this._viewport.removeChild(this._viewport.lastChild);
    }
}
//# sourceMappingURL=sectional.js.map