import fs from "fs";
import { capitalCase } from "../../tool";
import { FieldItem } from "../../ui";
import { ID, IDX, IX } from "../ID";
import { UqMan } from "../uqMan";
import { buildUQ } from "./buildUQ";
import { buildFieldItem } from "./fieldItem";
import { buildTsHeader, overrideTsFile, saveTsFileIfNotExists } from "./tools";

export function buildTsUqFolder(uq: UqMan, uqsFolder:string, uqAlias:string) {
	let uqFolder = uqsFolder + '/' + uqAlias;
	if (fs.existsSync(uqFolder) === false) {
		fs.mkdirSync(uqFolder);
	}
	let tsUq = buildTsHeader();
	tsUq += buildUQ(uq, uqAlias);
	overrideTsFile(`${uqFolder}/${uqAlias}.ts`, tsUq);
	saveTsIndexAndRender(uqFolder, uq, uqAlias);
}

function saveTsIndexAndRender(uqFolder:string, uq: UqMan, uqAlias:string) {
	let imports = '', sets = '';
	let {idArr, idxArr, ixArr} = uq;
	for (let i of [...idArr, ...idxArr, ...ixArr]) {
		let cName = capitalCase(i.name);
		imports += `\nimport * as ${cName} from './${cName}.ui';`;
		sets += `\n	Object.assign(uq.${cName}, ${cName});`;

		let tsUI = `import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemNumber, FieldItemString, FieldItemId } from "tonva-react";
import { ${cName} } from "./${uqAlias}";

/*--fields--*/
const fields = {
};
/*==fields==*/

const fieldArr: FieldItem[] = [
];

export const ui: UI = {
	label: "${cName}",
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

export function render(item: ${cName}):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
`;

		let path = `${uqFolder}/${cName}.ui.tsx`;
		saveTsFileIfNotExists(path, tsUI);

		let fields = buildFields(i);
		let tsFieldArr:string = buildFieldArr(i);

		replaceTsFileFields(path, fields);
		let tsImportFieldItemsBegin = 'import { FieldItem, ';
		let tsImportFieldItemsEnd = ' } from "tonva-react";';
		let tsImportFieldItems = 'FieldItemInt, FieldItemNum, FieldItemString, FieldItemId';
		replaceTsFileString(path, 
			{
				begin: tsImportFieldItemsBegin, 
				end: tsImportFieldItemsEnd, 
				content: tsImportFieldItemsBegin + tsImportFieldItems + tsImportFieldItemsEnd,
			}
		);
		replaceTsFileString(path, 
			{begin:'\nconst fieldArr: FieldItem[] = [\n', end: '\n];\n', content:tsFieldArr}
		);
	}

	let tsIndex = `import { UqExt as Uq } from './${uqAlias}';${imports}

export function setUI(uq: Uq) {${sets}
}
export * from './${uqAlias}';
`;
	overrideTsFile(`${uqFolder}/index.ts`, tsIndex);
}

function buildFields(i:ID|IDX|IX):{[name:string]:FieldItem} {
	switch (i.typeName) {
		case 'id': return buildIDFields(i as ID);
		case 'idx': return buildIDXFields(i);
		case 'ix': return buildIXFields(i);
	}
};

function buildIDFields(ID:ID):{[name:string]:FieldItem} {
	let ret:{[name:string]:FieldItem} = {};
	let {schema} = ID;
	let {keys, fields} = schema;
	for (let f of fields) {
		let {name} = f;
		let isKey = (keys as any[])?.findIndex(v => v.name === name) >= 0;
		ret[name] = buildFieldItem(f, isKey);
	}
	return ret;
}
function buildIDXFields(IDX:IDX):{[name:string]:FieldItem} {
	let ret:{[name:string]:FieldItem} = {};
	let {schema} = IDX;
	let {keys, fields} = schema;
	for (let f of fields) {
		let {name} = f;
		let isKey = (keys as any[])?.findIndex(v => v.name === name) >= 0;
		ret[name] = buildFieldItem(f, isKey);
	}
	return ret;
};

function buildIXFields(IX:IX):{[name:string]:FieldItem} {
	let ret:{[name:string]:FieldItem} = {};
	let {schema} = IX;
	let {keys, fields} = schema;
	for (let f of fields) {
		let {name} = f;
		let isKey = (keys as any[])?.findIndex(v => v.name === name) >= 0;
		ret[name] = buildFieldItem(f, isKey);
	}
	return ret;
};

function buildFieldArr(i:ID|IDX|IX):string {
	let ts = '\nconst fieldArr: FieldItem[] = [\n\t';
	switch (i.typeName) {
		case 'id': ts += buildIDFieldArr(i as ID); break;
		case 'idx': ts += buildIDXFieldArr(i); break;
		case 'ix': ts += buildIXFieldArr(i); break;
	}
	return ts += '\n];\n';
}
function buildIDFieldArr(i:ID):string {
	let {schema} = i;
	let ts = '';
	for (let f of schema.fields) {
		let {name} = f;
		if (name === 'id') continue;
		ts += `fields.${name}, `;
	}
	return ts;
}
function buildIDXFieldArr(i:IDX):string {
	let {schema} = i;
	let ts = '';
	for (let f of schema.fields) {
		let {name} = f;
		if (name === 'id') continue;
		ts += `fields.${name}, `;
	}
	return ts;
}
function buildIXFieldArr(i:IX):string {
	let {schema} = i;
	let ts = '';
	for (let f of schema.fields) {
		let {name} = f;
		if (name === 'ix') continue;
		if (name === 'id') continue;
		ts += `fields.${name}, `;
	}
	return ts;
}

function replaceTsFileFields(path: string, fields:{[name:string]:FieldItem}) {
	let text = fs.readFileSync(path).toString();
	let startStr = '\n/*--fields--*/';
	let endStr = '\n/*==fields==*/\n';
	let start = text.indexOf(startStr);
	if (start > 0) {
		let end = text.indexOf(endStr, start + startStr.length);
		if (end > 0) {
			let lBrace = text.indexOf('{', start + startStr.length);
			let rBrace = text.lastIndexOf('}', end);
			let oldText = text.substring(lBrace, rBrace+1);
			let fieldsText = buildFieldsFromOldText(fields, oldText);
			text = text.substring(0, start)
				+ startStr + '\nconst fields = {'
				+ fieldsText
				+ '\n};'
				+ text.substring(end);
			fs.writeFileSync(path, text);
		}
	}
}

const fieldItemReplaceProps = ['label', 'placeholder', 'widget', 'type'];
function buildFieldsFromOldText(fields:{[name:string]:FieldItem}, oldText:string):string {
	let ret = '';
	for (let i in fields) {
		let field = fields[i];
		setFieldOldProp(field, oldText);
		ret += buildFieldText(field);
	}
	return ret;
}

function setFieldOldProp(field:FieldItem, text:string) {
	let fieldStart = field.name + ':';
	let start = text.indexOf('\t' + fieldStart);
	if (start < 0) start = text.indexOf('\n' + fieldStart);
	if (start < 0) start = text.indexOf(' ' + fieldStart);
	if (start < 0) return;
	++start;
	let end = text.indexOf('}', start + fieldStart.length);
	if (end < 0) return;
	let fieldText = text.substring(start + fieldStart.length, end + 1);
	/* eslint no-eval: 0 */
	let obj = eval('(' + fieldText + ')');
	fieldItemReplaceProps.forEach(v => {
		let prop = obj[v];
		if (!prop) return;
		if (v === 'type') return; // 这个是由新的schema决定的
		(field as any)[v] = prop;
	});
}

function buildFieldText(field:FieldItem):string {
	let {$FieldItemType} = field as any;
	delete (field as any).$FieldItemType;
	let ret = '\n\t' + field.name + ': ';
	let json = JSON.stringify(field, null, '\t\t');
	json = json.replace('}', '\t}');
	ret += json;
	return ret + ' as ' + $FieldItemType + ',';
}

interface ReplaceSection {
	begin: string;
	end: string;
	content: string;
};
function replaceTsFileString(path:string, sec:ReplaceSection) {
	let text = fs.readFileSync(path).toString();
	let {begin, end, content} = sec;
	let b = text.indexOf(begin);
	if (b < 0) return;
	let e = text.indexOf(end, b + begin.length - 1);
	if (e < 0) return;
	text = text.substring(0, b) + content + text.substr(e + end.length);
	fs.writeFileSync(path, text);
}
