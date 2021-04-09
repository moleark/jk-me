import { UQs } from "uq-app";
import { Log } from "../Logger";

export const testItem4 = {
	name: 'Tag测试', 
	discription: 'Tag Test', 
	test: async (log: Log, uqs: UQs):Promise<void> => {
		/*
		let ret = await uqs.BzTest.IX({
			IX: uqs.BzTest.CustomerTag,
			id: 1,
			IDX: [uqs.BzTest.Tag],
			page: undefined,
		});
		log(ret);
		*/
	}
}
