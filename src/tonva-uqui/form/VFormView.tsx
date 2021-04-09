import { Context, Form, View } from "tonva-react";
import { CFormView } from "./CFormView";

export class VFormView<C extends CFormView<any>> extends View<C> {
	render(param: any) {
		let {schema, uiSchema} = this.controller;
		return <Form fieldLabelSize={2} formData={param}
			schema={schema}
			uiSchema={uiSchema}
			onButtonClick={this.onSubmit} />
	}

	private onSubmit = async (name:string, context: Context) => {
		context.setDisabled(name, true);
		await this.controller.submit(name, context);
		context.setDisabled(name, false);
	}
}