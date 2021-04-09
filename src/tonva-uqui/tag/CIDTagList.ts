import { CList, MidList } from "../list";
import { IXBase, IDBase } from "../base";
import { ListPageItems } from "../tools";
import { CSelect } from "./select";
import { MidTag, Tag } from "./MidTag";
import { renderItemTags } from "./parts";
import { observable } from "mobx";

export interface ItemTags<T> {
	item: T;
	typeArr: Tag[];
	typeColl: {[id:number]:Tag};
}

export class CIDTagList<T extends IDBase> extends CList<ItemTags<T>> {
	private midIDTagList: MidIDTagList<T>;
	constructor(midIDTagList: MidIDTagList<T>) {
		super(midIDTagList);
		this.setRes(midIDTagList.res);
		this.midIDTagList = midIDTagList;
	}

	async beforeStart():Promise<boolean> {
		await this.midIDTagList.midTag.init();
		return true;
	}

	protected onItemClick(item:any):void {
		let {midTag} = this.midIDTagList;
		let cSelect = new CSelect(this, item, midTag);
		cSelect.start();
	}

	protected renderItem(itemTags:ItemTags<T>, index:number):JSX.Element {
		return renderItemTags(this.midIDTagList, itemTags, index);
	}

	async onTagSelectChanged(item:any, tag:Tag, selected:boolean) {
		await this.midIDTagList.onTagSelectChanged(item, tag, selected);
	}
}

export class MidIDTagList<T extends IDBase> extends MidList<ItemTags<T>> {
	readonly midTag: MidTag;
	private itemTagsColl:{[id:number]:ItemTags<T>};
	renderTags: (types:Tag[]) => JSX.Element;
	constructor(midTag:MidTag) {
		super(midTag.uq, undefined);
		this.midTag = midTag;
		this.createPageItems();
	}

	async init() {
		await this.midTag.IX.loadSchema();
	}

	protected createPageItems():ItemTagsListPageItems<T> {
		let listPageItems = new ItemTagsListPageItems<T>(
			(pageStart:any, pageSize:number) => this.loadPageItems(pageStart, pageSize)
		);
		return listPageItems;
	}

	key:((item:ItemTags<T>) => number|string) = item => item.item.id;

	protected async loadPageItems(pageStart:any, pageSize:number):Promise<ItemTags<T>[]> {
		let result = await this.uq.IDxID<T, any>({
			ID: this.midTag.ID,
			IX: this.midTag.IX,
			ID2: this.midTag.tag,
			page: {start:pageStart, size:pageSize},
		});
		let [ret, ret2] = result;
		let itemTagsList:ItemTags<T>[] = [];
		this.itemTagsColl = {}
		for (let item of ret) {
			let p:ItemTags<T> = {item, typeArr:[], typeColl:{}};
			this.itemTagsColl[item.id] = p;
			itemTagsList.push(p);
		}
		for (let tagItem of ret2) {
			let {$xid, parent, id} = tagItem;
			let itemTags = this.itemTagsColl[$xid];
			this.addTag(itemTags, parent, id);
			/*
			let {typeColl, typeArr} = itemTags;
			let type = typeColl[parent];
			let midType = this.midTag.typeColl[parent];
			if (type === undefined) {
				type = {id:midType.id, name:midType.name, sub:[], parent:undefined};
				typeColl[parent] = type;
				typeArr.push(type);
			}
			type.sub.push(midType.sub.find(v => v.id === id));
			*/
		}
		return itemTagsList;
	}

	private addTag(itemTags:ItemTags<T>, typeId:number, tagId:number) {
		let {typeColl, typeArr} = itemTags;
		let midType = this.midTag.typeColl[typeId];
		let type = typeColl[typeId];
		let tag = midType.sub.find(v => v.id === tagId);
		if (type === undefined) {
			type = observable.object({id:midType.id, name:midType.name, sub:[tag], parent:undefined});
			typeColl[typeId] = type;
			typeArr.push(type);
		}
		else {
			type.sub.push(tag);
		}
	}

	private delTag(itemTags:ItemTags<T>, typeId:number, tagId:number) {
		let {typeColl, typeArr} = itemTags;
		let type = typeColl[typeId];
		if (type === undefined) return;
		let {sub} = type;
		let index = sub.findIndex(v => v.id === tagId);
		if (index < 0) return;
		sub.splice(index, 1);
		if (sub.length === 0) {
			let typeIndex = typeArr.findIndex(v => v.id === type.id);
			if (typeIndex >= 0) typeArr.splice(typeIndex, 1);
			delete typeColl[typeId];
		}
	}

	onTagSelectChanged = async (itemTags:ItemTags<T>, tag:Tag, selected:boolean) => {
		let {item} = itemTags;
		let {id:itemId} = item;
		let {id, parent} = tag;
		let ix:IXBase = {ix:undefined, xi:id};
		let acts:{[name:string]: IXBase[]} = {};
		acts[this.midTag.tag.name] = [ix];
		if (selected === true) {
			ix.id = itemId;
			await this.uq.Acts(acts);
			this.addTag(itemTags, parent, id);
		}
		else {
			ix.id = -itemId;
			await this.uq.Acts(acts);
			this.delTag(itemTags, parent, id);
		}
	}
}

class ItemTagsListPageItems<T extends IDBase> extends ListPageItems<ItemTags<T>> {
	itemId(item:ItemTags<T>):number {return item.item.id}
	newItem(id:number, itemTags:ItemTags<T>):ItemTags<T> {
		let {item, typeArr, typeColl} = itemTags;
		return {
			item: {...item, id},
			typeArr,
			typeColl,
		}
	}
	update(item: ItemTags<T>):Promise<void> {
		return;
	}
}
