import { capitalCase } from "../../tool";
import { FieldItem, FieldUIType } from "../../ui";

export function buildFieldItem(field:any, isKey:boolean):FieldItem {
	let $FieldItemType: string, fieldItemType: string, widget:FieldUIType;
	let {name, type} = field;
	switch (type) {
		case 'id':
			$FieldItemType = 'FieldItemId';
			fieldItemType = 'id';
			break;
		case 'char':
			$FieldItemType = 'FieldItemString';
			fieldItemType = 'string';
			widget = 'string';
			break;
		case 'smallint':
		case 'int':
		case 'bigint':
			$FieldItemType = 'FieldItemInt';
			fieldItemType = 'integer';
			widget = 'updown';
			break;
		case 'dec':
		case 'float':
		case 'double':
			$FieldItemType = 'FieldItemNum';
			fieldItemType = 'number';
			widget = 'number';
			break;
	}
	return {
		name,
		type: fieldItemType,
		isKey,
		widget,
		label: capitalCase(name),
		$FieldItemType,
	} as FieldItem;
}
