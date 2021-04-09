import { IDUI, Uq } from "tonva-react";
import { Detail, Master, Mid } from "../base";

export interface SheetUI {
	master: IDUI;
	detail: IDUI;
}

export class MidSheet<M extends Master, D extends Detail> extends Mid {
	readonly master: IDUI;
	readonly detail: IDUI;

	constructor(uq:Uq, ui: SheetUI, res?:any) {
		super(uq, res);
		let {master, detail} = ui;
		this.master = master;
		this.detail = detail;
	}

	async init(): Promise<void> {
	}

	async load(id:number):Promise<[M[],D[]]> {
		return [[], []];
	}

	async save(master:M, details:D[]):Promise<any> {
		let ret = await this.uq.ActDetail({
			master: {
				ID: this.master.ID,
				value: master,
			},
			detail: {
				ID: this.detail.ID,
				values: details,
			},
		});
		return ret;
	}
};
