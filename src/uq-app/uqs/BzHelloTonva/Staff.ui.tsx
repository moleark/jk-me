import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Staff } from "./BzHelloTonva";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	no: {
		"name": "no",
		"type": "string",
		"isKey": true,
		"widget": "string",
		"label": "No"
	} as FieldItemString,
	firstName: {
		"name": "firstName",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "FirstName"
	} as FieldItemString,
	lastName: {
		"name": "lastName",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "LastName"
	} as FieldItemString,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.no, fields.firstName, fields.lastName, 
];

export const ui: UI = {
	label: "Staff",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: Staff):JSX.Element {
	let {firstName, lastName, no} = item;
	return <><span>{firstName} {lastName}</span> <span className="text-muted ml-auto">{no}</span></>;
};
