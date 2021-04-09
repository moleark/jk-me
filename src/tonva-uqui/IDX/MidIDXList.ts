import { ID, IDX, Uq } from "tonva-react";
import { IDBase } from "../base";
import { MidIDListBase } from "../list";

export class MidIDXList<T extends IDBase> extends MidIDListBase<T> {
	readonly ID:ID;
	readonly IDX: IDX;
	constructor(uq:Uq, ID:ID, IDX:IDX) {
		super(uq, undefined);
		this.ID = ID;
		this.IDX = IDX;
	}

	async init() {
		await Promise.all([
			this.ID.loadSchema(),
			this.IDX.loadSchema(),
		]);
	}

	protected async loadPageItems(pageStart:any, pageSize:number):Promise<T[]> {
		let ret = await this.uq.ID<T>({
			IDX: this.ID,
			id: undefined,
			page: {start:pageStart, size:pageSize},
		});
		return ret;
	}
}
