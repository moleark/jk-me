import { ID } from "tonva-react";
import { CIX, MidIX } from "./CIX";
import { CIXList, MidIXList} from "./CIXList";
import { CIXSelect, MidIXSelectList } from "../select";

export interface IXEditProps extends MidIX {
	ID: ID;
}

export class CIXEdit extends CIX<IXEditProps> {
	private cIXList: CIXList<any>;
	protected async internalStart() {
		let {uq, IX, ID, id} = this.midIX;
		let midIXList = new MidIXList(uq, IX, ID, id);
		midIXList.onRightClick = this.onListRightClick;
		midIXList.renderItem = undefined;
		midIXList.onItemClick = undefined;
		midIXList.renderRight = undefined;
		this.cIXList = new CIXList(midIXList);
		await this.cIXList.start();
	}

	private onListRightClick = async () => {
		let {uq, ID, IX, id} = this.midIX;
		let midIXList = new MidIXSelectList(uq, ID, IX, id);
		midIXList.renderItem = undefined;
		midIXList.onSelectChange = this.onSelectChange;
		let cSelect = new CIXSelect(midIXList);
		await cSelect.start();
	}

	private onSelectChange = async (item:any, isSelected:boolean) => {
		let param:any = {};
		let {IX, id} = this.midIX;
		if (isSelected === false) {
			// id negtive means delete
			id = -id;
		}
		let idItem = {ix:id, id: item.id};
		param[IX.name] = [idItem];
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let ret = await this.midIX.uq.Acts(param);
		this.cIXList.update(idItem);
	} 
}
