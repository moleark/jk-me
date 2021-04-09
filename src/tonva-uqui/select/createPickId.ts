import { Context, ID, PickId, Uq } from "tonva-react";
import { CIDSelect,MidIDSelectList } from "./CIDSelect";

export function createPickId(uq: Uq, ID: ID): PickId {
	async function pickId(context:Context, name: string, value: number):Promise<any> {
		let mid: MidIDSelectList<any> = new MidIDSelectList(uq, ID);
		let cIDSelect = new CIDSelectInPickId(mid);
		let ret = await cIDSelect.call<any>();
		return ret;
	}
	return pickId;
}

export class CIDSelectInPickId extends CIDSelect<any, MidIDSelectList<any>> {
	constructor(mid: MidIDSelectList<any>) {
		super(mid);
		mid.onSelectChange = this.onSelectChange;
	}

	private onSelectChange = (item:any, isSelected:boolean) => {
		this.selectedItem = item;
		this.closePage();
		// closePage时，returnCall已经被调用了
		// this.returnCall(item);
	}
}
