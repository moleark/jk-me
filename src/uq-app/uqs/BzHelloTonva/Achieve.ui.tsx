import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Achieve } from "./BzHelloTonva";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	saleAmount: {
		"name": "saleAmount",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "SaleAmount"
	} as FieldItemNum,
	deliver: {
		"name": "deliver",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "Deliver"
	} as FieldItemNum,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.saleAmount, fields.deliver, 
];

export const ui: UI = {
	label: "Achieve",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: Achieve):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
