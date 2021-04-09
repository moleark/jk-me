import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { AccountCTO } from "./JkMe";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	commissionFormula: {
		"name": "commissionFormula",
		"type": "id",
		"isKey": false,
		"label": "CommissionFormula"
	} as FieldItemId,
	orderAmount: {
		"name": "orderAmount",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "OrderAmount"
	} as FieldItemNum,
	orderDeliver: {
		"name": "orderDeliver",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "OrderDeliver"
	} as FieldItemNum,
	orderPaid: {
		"name": "orderPaid",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "OrderPaid"
	} as FieldItemNum,
	amount: {
		"name": "amount",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "Amount"
	} as FieldItemNum,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.commissionFormula, fields.orderAmount, fields.orderDeliver, fields.orderPaid, fields.amount, 
];

export const ui: UI = {
	label: "AccountCTO",
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

export function render(item: AccountCTO):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
