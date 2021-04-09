import { CUqBase, UQs } from "uq-app";
import { Log } from "./Logger";
import { debugItems } from "./tester";
import { VBug } from "./VBug";
import { VConsole } from "./VConsole";

export interface DebugItem {
	name: string;
	discription?: string;
	test: (log:Log, uqs: UQs) => Promise<void>;
}

export class CBug extends CUqBase {
	debugItems = [...debugItems];
	currentItem: DebugItem;

	protected async internalStart() {
	}

	tab = () => this.renderView(VBug);

	load = async () => {

	}

	openDebugPage = async (item:DebugItem) => {
		this.currentItem = item;
		let console = await this.openVPage(VConsole);
		let {test} = item;
		let start = new Date();
		console.log(`=== test start at ${start} ===`);
		console.log();
		await test(console.log, this.uqs);
		let span = Date.now() - start.getTime();
		let ms = (1000 + (span % 1000)).toString().substr(1);
		let s = Math.floor(span / 1000);
		let m = Math.floor(s / 60);
		let t = '';
		if (m > 0) t += ms + '\'';
		t += s + '"' + ms;
		console.log();
		console.log(`=== test end: ${t} ===`);
	}

	test = async () => {
		let uqName = 'BizDev/hello-tonva';
		let roles = await this.getUqRoles(uqName);
		alert(roles);
	}
}
