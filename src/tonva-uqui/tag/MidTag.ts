import { ID, IX, Uq } from "tonva-react";
import { Mid } from "../base";

interface TagTree {
	id: number;
	parent: number;
	name: string;
	sub: {[id:number]: TagTree};
	count: number;
}

interface TagItem {
	id: number;
	parent: number;
	name: string;
}

export interface Tag {
	id: number;
	name: string;
	parent: number;
	sub: Tag[];
}

export class MidTag extends Mid {
	readonly ID: ID;
	readonly IX: IX;
	readonly tag: ID;
	readonly type: string;
	
	typeArr: Tag[];
	typeColl: {[id:number]: Tag};

	constructor(uq: Uq, ID:ID, IX:IX, tag:ID, type: string) {
		super(uq);
		this.ID = ID;
		this.IX = IX;
		this.tag = tag;
		this.type = type;
	}

	async init():Promise<void> {
		await this.load();
	}

	protected async load(): Promise<void> {
		if (this.typeArr) return;
		let ret = await Promise.all([
			this.ID.loadSchema(),
			this.IX.loadSchema(),
			this.tag.loadSchema(),
			this.uq.IDTree<TagItem>({
				ID: this.tag,
				parent: 0,
				key: this.type,
				level: 3,
				page: {start:0, size:1000},
			})
		]);
		this.buildTagTypes(ret[3]);
	}

	private buildTagTypes(items: TagItem[]) {
		let root:TagTree;
		let tree:TagTree = {id:0, parent:-1, name:undefined, sub:{}, count:0};
		for (let item of items) {
			let {id, parent, name} = item;
			if (parent === 0) {
				tree.sub[id] = root = {id, parent, name, sub: {}, count:0};
				continue;
			}
			let p = tree.sub[parent];
			let tag:TagTree = {id, parent, name, sub: {}, count:0};
			tree.sub[id] = tag;
			if (p !== undefined) {
				p.sub[id] = tag;
				p.count++;
			}
		}
		for (let i in tree.sub) {
			let tag = tree.sub[i];
			let {parent} = tag;
			if (parent > 0) {
				let p = tree.sub[parent];
				if (p) p.sub[Number(i)] = tag;
			}
		}
		this.typeArr = [];
		this.typeColl = {};
		if (!root) return;
		for (let i in root.sub) {
			let tree = root.sub[i];
			let {id, name} = tree;
			let type:Tag = {id, name, sub:[], parent: undefined};
			this.typeArr.push(type);
			this.typeColl[id] = type;
			for (let j in tree.sub) {
				let s = tree.sub[j];
				let {id, name} = s;
				type.sub.push({id, name, sub:undefined, parent:type.id})
			}
		}
	}
}
