import { ID, IX, Uq } from "tonva-react";
import { IDBase } from "../base";
import { MidIDListBase } from "../list";

export class MidIDList<T extends IDBase> extends MidIDListBase<T> {
	readonly ID:ID;
	
	constructor(uq:Uq, ID:ID) {
		super(uq);
		this.ID = ID;
	}

	async init() {
		//await this.ID.loadSchema();
	}

	protected async loadPageItems(pageStart:any, pageSize:number):Promise<T[]> {
		let ret = await this.uq.ID<T>({
			IDX: this.ID,
			id: undefined,
			page: {start:pageStart, size:pageSize},
		});
		return ret;
	}

	update(id:number, item:any) {
		item.id = id;
		this.listPageItems.update(item);
	}
}

export class MidIXIDList<T extends IDBase> extends MidIDList<T> {
	readonly IX:IX;
	private ix?:number|(number[]);
	constructor(uq:Uq, ID:ID, IX:IX, ix:number|(number[])) {
		super(uq, ID);
		this.IX = IX;
		this.ix = ix;
	}

	protected async loadPageItems(pageStart:any, pageSize:number):Promise<T[]> {
		let ret = await this.uq.IX<T>({
			IX: this.IX,
			IDX: [this.ID],
			ix: this.ix,
			page: {start:pageStart, size:pageSize},
		});
		/*
		for (let item of ret) {
			item.id = item.id;
			delete item.id;
		}
		*/
		return ret;
	}
}
