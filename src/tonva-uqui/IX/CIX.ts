import { Controller, ID, IX, Uq } from "tonva-react";
import { Mid } from "../base";
import { CIXList, MidIXList } from "./CIXList";

export class MidIX extends Mid {
	readonly IX: IX;
	readonly ID: ID;
	readonly id: number;
	constructor(uq:Uq, IX:IX, ID:ID, id:number, res?:any) {
		super(uq, res);
		this.IX = IX;
		this.ID = ID;
		this.id = id;
	}

	async init(): Promise<void> {
	}
}

export class CIX<P extends MidIX> extends Controller {
	protected readonly midIX: P;

	constructor(midIX: P) {
		super();
		this.setRes(midIX.res);
		this.midIX = midIX;
	}

	protected async internalStart() {
		let {uq, IX, ID, id} = this.midIX;
		let midIXList = new MidIXList(uq, IX, ID, id);
		midIXList.onRightClick = this.onItemEdit;
		midIXList.renderItem = undefined;
		midIXList.onItemClick = this.onItemClick;
		midIXList.renderRight = undefined;
		let idList = new CIXList(midIXList);
		await idList.start();
	}

	private onItemEdit = () => {

	}

	private onItemClick = (item:any) => {
		
	}
}
