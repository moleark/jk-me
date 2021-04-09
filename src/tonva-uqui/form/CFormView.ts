import { ButtonSchema, Context, Controller, FieldItem, FieldItems, FieldItemString, ID, Schema, UI, UiButton, UiIdItem, UiNumberItem, UiSchema } from "tonva-react";
import { FormUI } from "./FormUI";
import { VFormView } from "./VFormView";

export class CFormView<T> extends Controller {
	protected readonly ui: UI;
	schema: Schema;
	uiSchema: UiSchema;
	label: string|JSX.Element;
	submitCaption: string|JSX.Element;
	onSubmit: (name:string, context: Context) => Promise<void>;

	constructor(formUI: FormUI) {
		super();
		let {label, fieldArr, fields, submitCaption, t} = formUI;
		this.t = t;
		this.schema = this.buildItemSchema(fieldArr);
		this.uiSchema = this.buildUISchema(fields);
		this.label = t(label);
		this.submitCaption = t(submitCaption);
	}

	protected async internalStart() {
	}

	async setNO(ID: ID, fieldName:string = 'no') {
		let field = this.schema.find(v => v.name === fieldName);
		if (!field) return;
		if (field.type !== 'string') return;
		let noField = field as FieldItemString;
		let no = await ID.NO();
		noField.readOnly = true;
		noField.defaultValue = no;
		let uiField = this.uiSchema.items[fieldName];
		if (uiField) {
			uiField.readOnly = true;
			uiField.defaultValue = no;
		}
	}

	async submit(name:string, context: Context) {
		await this.onSubmit?.(name, context);
	}

	protected buildItemSchema(fieldArr: FieldItems): Schema {
		let ret:Schema = [];
		for (let f of fieldArr) {
			let {type, isKey} = f;
			let required = isKey; // (keys as any[]).findIndex(v => v.name === name) >= 0;
			let fieldItem = {
				...f,
				required,
			};
			switch (type) {
				default: ret.push(fieldItem); break;
			}
		}
		ret.push({
			name: 'submit',
			type: 'submit',
		} as ButtonSchema);
		return ret;
	}

	protected buildUISchema(fields: {[name:string]:FieldItem}):UiSchema {
		let items = {...fields as any};
		let uiButton: UiButton = {
			label: this.submitCaption ?? '提交',
			className: 'btn btn-primary',
			widget: 'button',
		};
		items['submit'] = uiButton;
		for (let i in fields) {
			let field = fields[i];
			let {type} = field;
			if (type === 'id') {
				let uiId = field as UiIdItem;
				let {pickId} = uiId;
				if (pickId === undefined) {
					let uiNumber = field as UiNumberItem;
					uiNumber.widget = 'number';
					uiNumber.placeholder = 'ID number, only on debugging';
				}
			}
		}
		let ret = {items};
		return ret;
	}

	renderForm(item:T):JSX.Element {
		let v = new VFormView(this);
		return v.render(item);
	}
}
