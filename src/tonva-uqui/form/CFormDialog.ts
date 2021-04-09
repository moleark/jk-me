import { CFormPage } from "./CFormPage";
import { VDialog } from "./VDialog";

export class CFormDialog<T> extends CFormPage<T> {
	protected async internalStart() {
		this.openVPage(VDialog)
	}

	close() {
		this.returnCall(null);
	}

	async submit(data:any) {
		let item: any;
		if (!this.item) item = this.item;
		else item = {};
		Object.assign(item, data);
		this.returnCall(item);
		this.closePage();
	}
}
