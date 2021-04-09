import fs from 'fs';
import path from 'path';
import { nav } from "../../components";
import { AppConfig } from "../../app";
import { UQsMan } from "../uqsMan";
import { UqMan } from "../uqMan";
import { buildTsHeader, getNameFromUq, overrideTsFile } from './tools';
import { buildTsUqFolder } from './buildTsUqFolder';

export async function buildUqsFolder(uqsFolder:string, options: AppConfig) {
	let uqErrors = await uqsStart(options);

	let uqsMan = UQsMan.value;
	let uqMans = uqsMan.getUqMans();
	
	let promiseArr:Promise<void>[] = [];
	if (uqErrors) {
		throw new Error(uqErrors.join('\n'));
	}

	for (let uq of uqMans) {
		promiseArr.push(loadUqEntities(uq));
	}
	await Promise.all(promiseArr);

	if (!fs.existsSync(uqsFolder)) {
		fs.mkdirSync(uqsFolder);
	}
	else {
		try {
			let files = fs.readdirSync(uqsFolder);
			for (const file of files) {
				let fullPath = path.join(uqsFolder, file);
				if (fs.lstatSync(fullPath).isFile() === true) {
					fs.unlinkSync(fullPath);
				}
			}	
		}
		catch (err) {
			throw err;
		}
	}
	let tsUqsIndexHeader = buildTsHeader();
	let tsUqsIndexContent = `\n\nexport interface UQs {`;
	let tsUqsIndexReExport = '\n';
	let tsUqsUI = `\n\nexport function setUI(uqs:UQs) {`;
	for (let uq of uqMans) {
		let {devName:o1, uqName:n1} = getNameFromUq(uq);
		let uqAlias = o1 + n1;
		buildTsUqFolder(uq, uqsFolder, uqAlias);
		//overrideTsFile(uqsFolder, uqAlias, tsUq);

		tsUqsIndexHeader += `\nimport * as ${uqAlias} from './${uqAlias}';`;
		tsUqsIndexContent += `\n\t${uqAlias}: ${uqAlias}.UqExt;`; 
		tsUqsIndexReExport += `\nexport * as ${uqAlias} from './${uqAlias}';`;
		tsUqsUI += `\n\t${uqAlias}.setUI(uqs.${uqAlias});`;
	}

	overrideTsFile(`${uqsFolder}/index.ts`, 
		tsUqsIndexHeader + tsUqsIndexContent + '\n}' + tsUqsIndexReExport + tsUqsUI + '\n}\n');
}

// 返回每个uq构建时的错误
async function uqsStart(uqsConfig: AppConfig):Promise<string[]> {
	nav.forceDevelopment = true;
	await nav.init();
	let retErrors = await UQsMan.build(uqsConfig);
	return retErrors;
}

async function loadUqEntities(uq:UqMan):Promise<void> {
	await uq.loadAllSchemas();
}
