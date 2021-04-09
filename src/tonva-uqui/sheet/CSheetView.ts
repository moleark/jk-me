import { Detail, Master } from "../base";
import { CSheet } from "./CSheet";
import { VSheetView } from "./VSheetView";

export class CSheetView<M extends Master, D extends Detail> extends CSheet<M, D> {
	protected async internalStart(id: number) {
		await this.load(id);
		this.openVPage(VSheetView);
	}
}
