import { Controller } from "tonva-react";
import { IDBase } from "../base";
import { listRight } from "../tools";
import { CList } from "../list";
import { MidTag, Tag } from "./MidTag";
import { CID, MidID, MidIDList } from "../ID";
import { VTags } from "./VTags";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CTagIDList<T extends IDBase> extends  Controller {
	readonly midTag: MidTag;
	constructor(midTag: MidTag) {
		super();
		this.setRes(midTag.res);
		this.midTag = midTag;
	}

	protected async internalStart() {
		await this.midTag.init();
		this.openVPage(VTags);
	}

	async showID(tags: Tag[]) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let midIDList: MidTagIDList<T> = new MidTagIDList<any>(
			this.midTag, tags.map(v => v.id)
		);
		let cShowTagIDList = new CShowTagIDList(midIDList);
		await cShowTagIDList.start();
	}
}

class CShowTagIDList<T extends IDBase> extends CList<T> {
	protected midIDList: MidTagIDList<T>;
	constructor(midIDList: MidTagIDList<T>) {
		super(midIDList);
		this.midIDList = midIDList;
	}

	async beforeStart():Promise<boolean> {
		await this.midIDList.midTag.init();
		return true;
	}

	protected async onItemClick(item:any):Promise<void> {
		let {midTag} = this.midIDList;
		let mid = new MidID(midTag.uq, {ID: midTag.ID});
		await mid.init();
		let cID = new CID(mid);
		cID.onItemClick(item);
		//let cSelect = new CSelect(this, item, midTag, this.res);
		//cSelect.start();
	}
	

	protected renderRight():JSX.Element {
		let {onRightClick, renderRight} = this.midIDList;
		if (!onRightClick) return null;
		return (renderRight ?? listRight)(onRightClick);
	}

	protected renderItem(item:T, index:number):JSX.Element {
		let {midTag, renderItem} = this.midIDList;
		let {ID} = midTag;
		//let {item, typeArr} = itemTags;
		return (renderItem ??  ID.render)(item, index);
		//return renderItemTags(this.props, itemTags, index);
	}
}

export class MidTagIDList<T extends IDBase> extends MidIDList<T> {
	readonly midTag: MidTag;
	readonly ids: number[];
	constructor(midTag:MidTag, ids:number[]) {
		let {uq, ID} = midTag;
		super(uq, ID);
		this.ids = ids;
	}
 
	async init() {
		await this.midTag.IX.loadSchema();
	}

	protected async loadPageItems(pageStart:any, pageSize:number):Promise<T[]> {
		let result = await this.uq.IXr<T>({
			IX: this.midTag.IX,
			IDX: [this.ID],
			ix: this.ids,
			page: {start:pageStart, size:pageSize},
		});
		return result;
	}
}
