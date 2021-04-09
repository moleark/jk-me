import { Detail, Master } from "../base";
import { CSheet } from "./CSheet";
import { VSheetEdit } from "./VSheetEdit";

export class CSheetEdit<M extends Master, D extends Detail> extends CSheet<M, D> {
	protected async internalStart(id: number) {
		await this.load(id);
		this.openVPage(VSheetEdit);
	}
}
