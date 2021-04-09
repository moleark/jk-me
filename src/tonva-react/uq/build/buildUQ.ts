import { camelCase, capitalCase } from "../../tool";
import { UqMan } from "../uqMan";
import { Action } from '../action';
import { Book } from '../book';
import { Query } from '../query';
import { Sheet } from '../sheet';
import { Tuid } from '../tuid';
import { UqEnum } from '../enum';
import { Map } from '../map';
import { History } from '../history';
import { Tag } from '../tag';
import { Pending } from '../pending';
import { Entity } from '../entity';
import { ID, IX, IDX } from '../ID';
import { ArrFields, Field } from '../uqMan';
import { entityName } from "./tools";

export function buildUQ(uq:UqMan, uqAlias:string) {
	let tsImport = `
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq`;
	let ts:string = `\n\n`;
	ts += '\n//===============================';
	ts += `\n//======= UQ ${uq.name} ========`;
	ts += '\n//===============================';
	ts += '\n';
	
	uq.enumArr.forEach(v => ts += uqEntityInterface<UqEnum>(v, buildEnumInterface));

	uq.tuidArr.forEach(v => ts += uqEntityInterface<Tuid>(v, buildTuidInterface));
    uq.actionArr.forEach(v => ts += uqEntityInterface<Action>(v, buildActionInterface));
    uq.sheetArr.forEach(v => ts += uqEntityInterface<Sheet>(v, buildSheetInterface));
    uq.queryArr.forEach(v => ts += uqEntityInterface<Query>(v, buildQueryInterface));
    uq.bookArr.forEach(v => ts += uqEntityInterface<Book>(v, buildBookInterface));
    uq.mapArr.forEach(v => ts += uqEntityInterface<Map>(v, buildMapInterface));
    uq.historyArr.forEach(v => ts += uqEntityInterface<History>(v, buildHistoryInterface));
    uq.pendingArr.forEach(v => ts += uqEntityInterface<Pending>(v, buildPendingInterface));
	uq.tagArr.forEach(v => ts += uqEntityInterface<Tag>(v, buildTagInterface));
	uq.idArr.forEach(v => ts += uqEntityInterface<ID>(v, buildIDInterface));
	uq.idxArr.forEach(v => ts += uqEntityInterface<IDX>(v, buildIDXInterface));
	uq.idxArr.forEach(v => ts += uqEntityInterface<IDX>(v, buildIDXActParamInterface));	
	uq.ixArr.forEach(v => ts += uqEntityInterface<IX>(v, buildIXInterface));

	ts += buildActsInterface(uq);

	ts += `
\nexport interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;
`;
	function appendArr<T extends Entity>(arr:T[], type:string, tsBuild: (v:T) => string) {
		if (arr.length === 0) return;
		let tsLen = ts.length;
		arr.forEach(v => ts += tsBuild(v));
		if (ts.length - tsLen > 0) {
			tsImport += ', Uq' + type;
		}
	}
	appendArr<Tuid>(uq.tuidArr, 'Tuid', v => uqBlock<Tuid>(v, buildTuid));
	appendArr<Action>(uq.actionArr, 'Action', v => uqBlock<Action>(v, buildAction));
	appendArr<Sheet>(uq.sheetArr, 'Sheet', v => uqBlock<Sheet>(v, buildSheet));
	appendArr<Book>(uq.bookArr, 'Book', v => uqBlock<Book>(v, buildBook));
	appendArr<Query>(uq.queryArr, 'Query', v => uqBlock<Query>(v, buildQuery));
	appendArr<Map>(uq.mapArr, 'Map', v => uqBlock<Map>(v, buildMap));
	appendArr<History>(uq.historyArr, 'History', v => uqBlock<History>(v, buildHistory));
	appendArr<Pending>(uq.pendingArr, 'Pending', v => uqBlock<Pending>(v, buildPending));
	appendArr<Tag>(uq.tagArr, 'Tag', v => uqBlock<Tag>(v, buildTag));
	appendArr<ID>(uq.idArr, 'ID', v => uqBlock<ID>(v, buildID));
	appendArr<IDX>(uq.idxArr, 'IDX', v => uqBlock<IDX>(v, buildIDX));
	appendArr<IX>(uq.ixArr, 'IX', v => uqBlock<IX>(v, buildIX));
	ts += '\n}\n';
	tsImport += ' } from "tonva-react";';
	return tsImport + ts;
}

function uqEntityInterface<T extends Entity>(entity: T, buildInterface: (entity: T)=>string) {
	let {name} = entity;
	if (name.indexOf('$') > 0) return '';
	let entityCode = buildInterface(entity);
	if (!entityCode) return '';
	return '\n' + entityCode + '\n';
}

function uqBlock<T extends Entity>(entity: T, build: (entity: T)=>string) {
	let {name} = entity;
	if (name.indexOf('$') > 0) return '';
	let entityCode = build(entity);
	if (!entityCode) return '';
	return '\n' + entityCode;
}


function buildFields(fields: Field[], isInID:boolean = false, indent:number = 1) {
	if (!fields) return '';
	let ts = '';
	for (let f of fields) {
		ts += buildField(f, isInID, indent);
	}
	return ts;
}

const fieldTypeMap:{[type:string]:string} = {
	"char": "string",
	"text": "string",
	"id": "number",
	"textid": "string",
	"int": "number",
	"bigint": "number",
	"smallint": "number",
	"tinyint": "number",
	"dec": "number",
	"float": "number",
	"double": "number",
};
const sysFields = ['id', 'master', 'row', 'no', '$create', '$update', '$owner'];
function buildField(field: Field, isInID:boolean, indent:number = 1) {
	let {name, type} = field;
	let s = fieldTypeMap[type];
	if (!s) s = 'any';
	let q:string = (isInID === true && sysFields.indexOf(name) >= 0)? '?' : '';
	return `\n${'\t'.repeat(indent)}${name}${q}: ${s};`;
}

function buildArrs(arrFields: ArrFields[]):string {
	if (!arrFields) return '';
	let ts = '\n';
	for (let af of arrFields) {
		ts += `\t${camelCase(af.name)}: {`;
		ts += buildFields(af.fields, false, 2);
		ts += '\n\t}[];\n';
	}
	return ts;
}

/*
const typeMap:{[type:string]:string} = {
	action: 'Action',
	query: 'Query',
}
*/
function buildReturns(entity:Entity, returns:ArrFields[]):string {
	if (!returns) return;
	//let {typeName} = entity;
	//let type = typeMap[typeName] || typeName;
	let {sName} = entity;
	sName = capitalCase(sName);
	let ts = '';
	for (let ret of returns) {
		let retName = capitalCase(ret.name);
		ts += `interface Return${sName}${retName} {`;
		ts += buildFields(ret.fields);
		ts += '\n}\n';
	}

	ts += `interface Result${sName} {\n`;
	for (let ret of returns) {
		let retName = capitalCase(ret.name);
		ts += `\t${ret.name}: Return${sName}${retName}[];\n`;
	}
	ts += '}';
	return ts;
}

function buildTuid(tuid: Tuid) {
	let ts = `\t${entityName(tuid.sName)}: UqTuid<Tuid${capitalCase(tuid.sName)}>;`;
	return ts;
}

function buildTuidInterface(tuid: Tuid) {
	let ts = `export interface Tuid${capitalCase(tuid.sName)} {`;
	ts += buildFields(tuid.fields);
	ts += '\n}';
	return ts;
}

function buildAction(action: Action) {
	let ts = `\t${entityName(action.sName)}: UqAction<Param${capitalCase(action.sName)}, Result${capitalCase(action.sName)}>;`;
	return ts;
}

function buildActionInterface(action: Action) {
	let ts = `export interface Param${capitalCase(action.sName)} {`;
	ts += buildFields(action.fields);
	ts += buildArrs(action.arrFields);
	ts += '\n}\n';
	ts += buildReturns(action, action.returns);
	return ts;
}

function buildEnumInterface(enm: UqEnum) {
	let {schema} = enm;
	if (!schema) return;
	let {values} = schema;
	let ts = `export enum ${capitalCase(enm.sName)} {`;
	let first:boolean = true;
	for (let i in values) {
		if (first === false) {
			ts += ',';
		}
		else {
			first = false;
		}
		let v = values[i];
		ts += '\n\t' + i + ' = ';
		if (typeof v === 'string') {
			ts += '"' + v + '"';
		}
		else {
			ts += v;
		}
	}
	return ts += '\n}'
}

function buildQuery(query: Query) {
	let {sName} = query;
	let ts = `\t${entityName(sName)}: UqQuery<Param${capitalCase(sName)}, Result${capitalCase(sName)}>;`;
	return ts;
}

function buildQueryInterface(query: Query) {
	let ts = `export interface Param${capitalCase(query.sName)} {`;
	ts += buildFields(query.fields);
	ts += '\n}\n';
	ts += buildReturns(query, query.returns);
	return ts;
}

function buildSheet(sheet: Sheet) {
	let {sName, verify} = sheet;
	let cName = capitalCase(sName);
	let v = verify? `Verify${cName}` : 'any';
	let ts = `\t${entityName(sName)}: UqSheet<Sheet${cName}, ${v}>;`;
	return ts;
}

function buildSheetInterface(sheet: Sheet) {
	let {sName, fields, arrFields, verify} = sheet;
	let ts = `export interface Sheet${capitalCase(sName)} {`;
	ts += buildFields(fields);
	ts += buildArrs(arrFields);
	ts += '}';

	if (verify) {
		let {returns} = verify;
		ts += `\nexport interface Verify${capitalCase(sName)} {`;
		for (let item of returns) {
			let {name:arrName, fields} = item;
			ts += '\n\t' + arrName + ': {';
			ts += buildFields(fields, false, 2);
			ts += '\n\t}[];';
		}
		ts += '\n}';
	}
	return ts;
}

function buildBook(book: Book):string {
	let {sName} = book;
	let ts = `\t${entityName(sName)}: UqBook<Param${capitalCase(sName)}, Result${capitalCase(sName)}>;`;
	return ts;
}

function buildBookInterface(book: Book):string {
	let {sName, fields, returns} = book;
	let ts = `export interface Param${capitalCase(sName)} {`;
	ts += buildFields(fields);
	ts += '\n}\n';
	ts += buildReturns(book, returns);
	return ts;
}

function buildMap(map: Map):string {
	let {sName} = map;
	let ts = `\t${entityName(sName)}: UqMap;`;
	return ts;
}

function buildMapInterface(map: Map):string {
	/*
	let {sName, fields, returns} = map;
	let ts = `export interface Param${capitalCaseString(sName)} {`;
	ts += buildFields(fields);
	ts += '\n}\n';
	ts += buildReturns(map, returns);
	return ts;
	*/
	return '';
}

function buildHistory(history: History):string {
	let {sName} = history;
	let ts = `\t${entityName(sName)}: UqHistory<Param${capitalCase(sName)}, Result${capitalCase(sName)}>;`;
	return ts;
}

function buildHistoryInterface(history: History):string {
	let {sName, fields, returns} = history;
	let ts = `export interface Param${capitalCase(sName)} {`;
	ts += buildFields(fields);
	ts += '\n}\n';
	ts += buildReturns(history, returns);
	return ts;
}

function buildPending(pending: Pending):string {
	let {sName} = pending;
	let ts = `\t${entityName(sName)}: UqPending<any, any>;`;
	return ts;
}

function buildPendingInterface(pending: Pending):string {
	/*
	let {sName, fields, returns} = pending;
	let ts = `export interface Param${capitalCaseString(sName)} {`;
	ts += buildFields(fields);
	ts += '\n}\n';
	ts += buildReturns(pending, returns);
	return ts;
	*/
	return '';
}

function buildTag(tag: Tag):string {
	let {sName} = tag;
	let ts = `\t${entityName(sName)}: UqTag;`;
	return ts;
}

function buildID(id: ID):string {
	let {sName} = id;
	let ts = `\t${entityName(sName)}: UqID<any>;`;
	return ts;
}

function buildIDX(idx: IDX):string {
	let {sName} = idx;
	let ts = `\t${entityName(sName)}: UqIDX<any>;`;
	return ts;
}

function buildIX(ix: IX):string {
	let {sName} = ix;
	let ts = `\t${entityName(sName)}: UqIX<any>;`;
	return ts;
}

function buildTagInterface(tag: Tag):string {
	return;
}

function buildIDInterface(idEntity: ID):string {
	let {sName, fields, schema} = idEntity;
	let {keys:schemaKeys} = schema;
	let keys:Field[] = [], others:Field[] = [];
	for (let f of fields) {
		let {name} = f;
		if (name === 'id') continue;
		if ((schemaKeys as any[]).find(v => v.name === name)) keys.push(f);
		else others.push(f);
	}
	let ts = `export interface ${capitalCase(sName)} {`;
	ts += `\n\tid?: number;`;
	ts += buildFields(keys, true);
	ts += buildFields(others, true);
	ts += '\n}';
	return ts;
}

function buildIDXInterface(idx: IDX):string {
	let {sName, fields, schema} = idx;
	let {exFields} = schema;
	let ts = `export interface ${capitalCase(sName)} {`;
	let indent = 1;
	for (let field of fields) {
		let {name, type} = field;
		let s = fieldTypeMap[type];
		if (!s) s = 'any';
		ts += `\n${'\t'.repeat(indent)}${name}`;
		if (name !== 'id') ts += '?';
		ts += `: ${s};`;
	}

	ts += `\n\t$act?: number;`;

	let hasTrack:boolean = false;
	let hasMemo:boolean = false;
	if (exFields) {
		for (let exField of exFields) {
			let {track, memo} = exField;
			if (track === true) hasTrack = true;
			if (memo === true) hasMemo = true;
		}
	}
	if (hasTrack === true) {
		ts += `\n\t$track?: number;`;
	}
	if (hasMemo === true) {
		ts += `\n\t$memo?: string;`;
	}
	ts += '\n}';
	return ts;
}

function buildIDXActParamInterface(idx: IDX):string {
	let {sName, fields, schema} = idx;
	let {exFields} = schema;
	let ts = `export interface ActParam${capitalCase(sName)} {`;
	let indent = 1;
	for (let field of fields) {
		let {name, type} = field;
		let s = fieldTypeMap[type];
		if (!s) s = 'any';
		ts += `\n${'\t'.repeat(indent)}${name}`;
		if (name !== 'id') ts += '?';
		ts += `: ${s}|IDXValue;`;
	}

	ts += `\n\t$act?: number;`;

	let hasTrack:boolean = false;
	let hasMemo:boolean = false;
	if (exFields) {
		for (let exField of exFields) {
			let {track, memo} = exField;
			if (track === true) hasTrack = true;
			if (memo === true) hasMemo = true;
		}
	}
	if (hasTrack === true) {
		ts += `\n\t$track?: number;`;
	}
	if (hasMemo === true) {
		ts += `\n\t$memo?: string;`;
	}
	ts += '\n}';
	return ts;
}

function buildIXInterface(ix: IX):string {
	let {sName, fields} = ix;
	let ts = `export interface ${capitalCase(sName)} {`;
	ts += buildFields(fields);
	ts += '\n}';
	return ts;
}

function buildActsInterface(uq: UqMan) {
	let ts = `\nexport interface ParamActs {`;
	uq.idArr.forEach(v => {
		let {sName} = v;
		ts += `\n\t${camelCase(sName)}?: ${capitalCase(sName)}[];`;
	});
	uq.idxArr.forEach(v => {
		let {sName} = v;
		ts += `\n\t${camelCase(sName)}?: ActParam${capitalCase(sName)}[];`;
	});
	uq.ixArr.forEach(v => {
		let {sName} = v;
		ts += `\n\t${camelCase(sName)}?: ${capitalCase(sName)}[];`;
	});
	ts += '\n}\n';
	return ts;
}
