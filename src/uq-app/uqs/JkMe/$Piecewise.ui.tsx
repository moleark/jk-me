import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { $Piecewise } from "./JkMe";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	name: {
		"name": "name",
		"isKey": true,
		"label": "Name"
	} as undefined,
	mul: {
		"name": "mul",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Mul"
	} as FieldItemInt,
	div: {
		"name": "div",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Div"
	} as FieldItemInt,
	offset: {
		"name": "offset",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Offset"
	} as FieldItemInt,
	asc: {
		"name": "asc",
		"isKey": false,
		"label": "Asc"
	} as undefined,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.name, fields.mul, fields.div, fields.offset, fields.asc, 
];

export const ui: UI = {
	label: "$Piecewise",
	fieldArr,
	fields,
};

const resRaw: Res<any> = {
	zh: {
	},
	en: {
	}
};
const res: any = {};
setRes(res, resRaw);

export const t:TFunc = (str:string|JSX.Element): string|JSX.Element => {
	return res[str as string] ?? str;
}

export function render(item: $Piecewise):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
