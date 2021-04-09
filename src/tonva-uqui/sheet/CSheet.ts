import { makeObservable, observable } from "mobx";
import { Context, Controller } from "tonva-react";
import { createPickId } from "../select";
import { CFormPage, FormUI } from "../form";
import { Detail, Master } from "../base";
import { MidSheet } from "./MidSheet";

export abstract class CSheet<M extends Master, D extends Detail> extends Controller {
	readonly midSheet: MidSheet<M, D>;
	id: number;
	master: M = null;
	details: D[] = [];
	detail: D = null;

	constructor(mid: MidSheet<M, D>) {
		super();
		makeObservable(this, {
			master: observable,
			details: observable,
		});
		this.setRes(mid.res);
		this.midSheet = mid;
	}

	protected async load(id:number) {
		this.id = id;
		let [master, details] = await this.midSheet.load(id);
		this.master = master[0];
		this.details = details;
	}

	async saveSheet() {
		let ret = await this.midSheet.save(this.master, this.details);
		return ret;
	}
	
	afterMasterNew() {

	}

	private serial:number = 1;
	editDetail = async (detail: D) => {
		let {uq, detail:detailFormUI} = this.midSheet;
		let {ID, fieldCustoms} = detailFormUI;
		let uiForm = new FormUI(ID.ui, fieldCustoms);
		if (fieldCustoms) {
			for (let i in fieldCustoms) {
				let field = fieldCustoms[i];
				let {ID} = field;
				if (ID) {
					uiForm.setIDUi(i, createPickId(uq, ID), ID.render);
				}
			}
		}
		uiForm.hideField('master', 'row');
		let cForm = new CFormPage(uiForm, detail);
		cForm.onSubmit = async (name:string, context: Context) => {
			let values = context.data;
			let serial = values['#'];
			if (!serial) {
				values['#'] = this.serial++;
				this.details.push(values);
			}
			else {
				let index = this.details.findIndex(v => (v as any)['#'] === serial);
				if (index >= 0) {
					Object.assign(this.details[index], values);
				}
			}
			this.closePage();
			if (detail === undefined) {
				let cForm = new CFormPage(uiForm, detail);
				await cForm.start();
			}
		}
		await cForm.start();
	}
}
