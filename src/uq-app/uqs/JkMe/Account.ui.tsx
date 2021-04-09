import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Account } from "./JkMe";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	user: {
		"name": "user",
		"type": "id",
		"isKey": true,
		"label": "User"
	} as FieldItemId,
	$owner: {
		"name": "$owner",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "$owner"
	} as FieldItemInt,
	$create: {
		"name": "$create",
		"isKey": false,
		"label": "$create"
	} as undefined,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.user, fields.$owner, fields.$create, 
];

export const ui: UI = {
	label: "Account",
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

export function render(item: Account):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
