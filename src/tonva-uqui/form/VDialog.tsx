import { CFormDialog } from "./CFormDialog";
import { VFormPage } from "./VFormPage";

export class VDialog extends VFormPage<CFormDialog<any>> {
	protected afterBack():void {
		this.controller.close();
	}
}
