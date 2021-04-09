import { CFormView } from "./CFormView";
import { FormUI } from "./FormUI";
import { VFormPage } from "./VFormPage";

export class CFormPage<T> extends CFormView<T> {
	item: T;
	constructor(formUI: FormUI, item: T) {
		super(formUI);
		this.item = item;
	}

	protected async internalStart() {
		this.openVPage<any, any>(VFormPage);
	}
}
