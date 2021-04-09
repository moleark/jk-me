import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { $PiecewiseDetail } from "./BzHelloTonva";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	parent: {
		"name": "parent",
		"type": "id",
		"isKey": true,
		"label": "Parent"
	} as FieldItemId,
	row: {
		"name": "row",
		"type": "integer",
		"isKey": true,
		"widget": "updown",
		"label": "Row"
	} as FieldItemInt,
	sec: {
		"name": "sec",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Sec"
	} as FieldItemInt,
	value: {
		"name": "value",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Value"
	} as FieldItemInt,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.parent, fields.row, fields.sec, fields.value, 
];

export const ui: UI = {
	label: "$PiecewiseDetail",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: $PiecewiseDetail):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
