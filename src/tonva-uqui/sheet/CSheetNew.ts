//import { createPickId } from "../select";
import { Detail, Master } from "../base";
import { CFormDialog, FormUI } from "../form";
import { CSheet } from "./CSheet";
import { VSheetEdit } from "./VSheetEdit";

export class CSheetNew<M extends Master, D extends Detail> extends CSheet<M, D> {
	protected async internalStart() {
		let {master:masterUI} = this.midSheet;
		let {ID, fieldCustoms} = masterUI;
		let formUI = new FormUI(ID.ui, fieldCustoms);
		//await formUI.setNO(ID);
		/*
		if (fieldItems) {
			for (let i in fieldItems) {
				let field = fieldItems[i];
				let {ID} = field;
				if (ID) {
					formUI.setIDUi(i, createPickId(uq, ID), ID.render);
				}
			}
		}
		*/
		let cDialog = new CFormDialog(formUI, undefined);
		await cDialog.setNO(ID);
		let master = await cDialog.call<M>();
		if (master === null) return;
		this.master = master;
		this.openVPage(VSheetEdit);
	}
}
