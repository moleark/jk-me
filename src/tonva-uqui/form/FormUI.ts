import { ChangedHandler, ChangingHandler, FieldCustoms, FieldItem, FieldItemId, FieldItemString, ID, PickId, TFunc, UI } from "tonva-react";
import { createPickId } from '../select';

export class FormUI {
	label: string|JSX.Element;
	readonly fieldArr: FieldItem[];
	readonly fields: {[name:string]: FieldItem};
	submitCaption: string;
	t: TFunc;

	constructor(ui: UI, fieldCustoms:FieldCustoms, t?: TFunc) {
		this.t = t ?? ((str:string|JSX.Element) => str);
		let {label, fieldArr, fields} = ui;
		this.label = label;
		this.fieldArr = [];
		this.fields = {};
		for (let i in fields) {
			let field = fields[i];
			let fieldCustom = fieldCustoms?.[i];
			let index = fieldArr.findIndex(v => v === field);
			let f:FieldItem;
			if (fieldCustom) {
				let label = this.t(fieldCustom.label ?? field.label);
				f = {...field, ...fieldCustom, label};
				let {ID} = field;
				if (ID) {
					let idField = f as FieldItemId;
					idField.widget = 'id';
					idField.pickId = createPickId(ID.uq.proxy, ID);
					(idField as any).Templet = ID.render;
				}
			}
			else {
				let label = this.t(field.label);
				f = {...field, label};
			}
			this.fields[i] = f;
			this.fieldArr[index] = f;
		}
		/*
		if (fieldCustoms) {
			for (let i in fieldCustoms) {
				let field = fieldCustoms[i];
				let {ID} = field;
				if (ID) {
					this.setIDUi(i, createPickId(ID.uq.proxy, ID), ID.render);
				}
			}
		}
		*/
	}

	setIDUi(fieldName:string, pickId: PickId, render: (values:any) => JSX.Element) {
		let field = this.fields[fieldName];
		if (field === undefined) {
			alert(`${fieldName} not defined in UI`);
			return;
		}
		if (field.type !== 'id') {
			alert(`${fieldName} is not id UI`);
			return;
		}
		let idField = field as FieldItemId;
		idField.widget = 'id';
		idField.pickId = pickId;
		(idField as any).Templet = render;
	}

	async setNO(ID:ID, fieldName:string = 'no'):Promise<void> {
		let field = this.fields[fieldName];
		if (!field) return;
		if (field.type !== 'string') return;
		let noField = field as FieldItemString;
		noField.readOnly = true;
		let no = await ID.NO();
		noField.defaultValue = no;
	}

	hideField(...fieldNames:string[]) {
		for (let fieldName of fieldNames) {
			let index = this.fieldArr.findIndex(v => v.name === fieldName);
			if (index >= 0) this.fieldArr.splice(index, 1);
		}
	}

	setFieldChanged(fieldName: string, onChanged: ChangedHandler) {
		let field = this.fields[fieldName];
		if (field) field.onChanged = onChanged;
	}

	setFieldChanging(fieldName: string, onChanging: ChangingHandler) {
		let field = this.fields[fieldName];
		if (field) field.onChanging = onChanging;
	}
}
