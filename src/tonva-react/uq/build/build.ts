import fs from 'fs';
import { env } from '../../tool';
import { AppConfig } from '../../app';
import { lastBuildTime, red, saveTsFile, saveSrcTsFileIfNotExists } from './tools';
import { buildUqsFolder } from './uqsFolder';
import { buildTsIndex } from './tsIndex';
import { buildTsCApp } from './tsCApp';
import { buildTsCBase } from './tsCBase';
import { buildTsVMain } from './tsVMain';
import { BuildContext } from './context';
import { buildTsApp } from './tsApp';

export async function build(options: AppConfig, uqSrcPath: string) {
	let buildContext = new BuildContext(uqSrcPath);
	// 只从test 数据库构建uq ts
	env.testing = true;

	if (lastBuildTime > 0) {
		console.log(red, 'quit !');
		return;
	}
	let {uqTsSrcPath} = buildContext;
	if (!fs.existsSync(uqTsSrcPath)) {
		fs.mkdirSync(uqTsSrcPath);
	}
	//buildTsAppName(options);
	//buildTsAppConfig(options);
	
	let tsIndex = buildTsIndex();
	saveTsFile(buildContext, 'index', tsIndex);
	let tsCApp = buildTsCApp();
	saveSrcTsFileIfNotExists(buildContext, 'CApp', 'ts', tsCApp);
	let tsCBase = buildTsCBase();
	saveTsFile(buildContext, 'CBase', tsCBase);
	let tsVMain = buildTsVMain();
	saveSrcTsFileIfNotExists(buildContext, 'VMain', 'tsx', tsVMain);
	let tsApp = buildTsApp();
	saveSrcTsFileIfNotExists(buildContext, 'App', 'tsx', tsApp);

	saveTsFile(buildContext, 'uqs', '');
	fs.unlinkSync(uqTsSrcPath + '/uqs.ts');
	await buildUqsFolder(uqTsSrcPath + '/uqs', options);
};
