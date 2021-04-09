import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { CustomerTag } from "./BzHelloTonva";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	id2: {
		"name": "id2",
		"type": "id",
		"isKey": false,
		"label": "Id2"
	} as FieldItemId,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	
];

export const ui: UI = {
	label: "CustomerTag",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: CustomerTag):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
