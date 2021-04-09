import { UQs } from "uq-app";
import { Log } from "../Logger";

export const testTimesChange = {
	name: 'TimesChange', 
	discription: 'Test Times Change hours', 
	test: async (log: Log, uqs: UQs):Promise<void> => {
		/*
		let tc = uqs.BzTimesChange;
		let ret = await tc.IDActs({
			staff: [
				{id: undefined, no: '101', firstName: 'Song', lastName: 'Sha'}
			]
		});
		log(ret);
		let id = 13369344;
		let r1 = await tc.IDActs({
			hours: [
				{id, onsite:{value: 3, time: new Date(2021, 0, 1)}}
			]
		});
		log(r1);

		let month = await tc.IDLog({
			IDX: tc.Hours,
			field: 'onsite',
			id,
			log: 'month',
			timeZone: -5,
			page: {
				start: undefined,
				end: new Date(2021,0,1).getTime(),
				size: 10,
			}
		});
		log(month);

		let sum = await tc.IDSum({
			IDX: tc.Hours,
			field: ['onsite'],
			id: [id],
			far: undefined,
			near: new Date().getTime(),
		});
		log(sum);
		*/
	}
}
