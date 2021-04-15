import { action, makeObservable, observable, runInAction } from "mobx";
import { Controller, PageItems } from "tonva-react";
import { HistoryPageItems, TimeSpan } from "../tools";
import { CList } from "../list";
import { MidIDX } from "./MidIDX";
import { MidIDXList } from "./MidIDXList";
import { res } from "./res";
import { VEdit } from "./VEdit";
import { VHistory, VHistoryPage } from "./VHistory";
import { VView } from "./VView";

export class CIDX extends Controller {
	timeSpan:TimeSpan = null;
	spanValues: any = null;
	dayValues: number[] = null;
	midIDX: MidIDX;
	private cList: CList<any>;
	private historyPageItems: HistoryPageItems<any>
	constructor(midIDX: MidIDX) {
		super();
		makeObservable(this, {
			timeSpan: observable,
			spanValues: observable,
			dayValues: observable.ref,
			setTimeSpan: action,
		});
		this.setRes(res);
		this.setRes(midIDX.res);
		this.midIDX = midIDX;
		this.historyPageItems = new HistoryPageItems<any>(midIDX.historyLoader);
	}

	protected async beforeStart():Promise<boolean> {
		await this.midIDX.init();
		let {uq, ID, IDX} = this.midIDX;
		let midIDXList = new MidIDXList(uq, ID, IDX);
		midIDXList.onItemClick = this.onItemClick;
		this.cList = new CList(midIDXList);
		return true;
	}

	protected async internalStart() {
		await this.cList.start();
	}

	async showItemView(item: any) {
		await this.midIDX.init();
		this.item = item;
		await this.setTimeSpan('month');
		this.openVPage(VView);
	}

	item:any;
	onItemClick: (item:any) => void = async (item:any) => {
		this.item = item;
		await this.setTimeSpan('month');
		this.openVPage(VView);
	}

	onItemEdit = async ():Promise<void> => {
		this.openVPage(VEdit);
	}

	async setTimeSpan(span: 'day'|'week'|'month'|'year') {
		let timeSpan = TimeSpan.create(span);
		this.timeSpan = timeSpan;
		await this.loadSum(timeSpan);
	}

	private async loadSum(timeSpan?: TimeSpan) {
		let {far, near} = timeSpan ?? this.timeSpan;
		let ret = await this.midIDX.loadSum(this.item.id, far, near);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let [values, sums] = ret;
		let sum = sums[0];
		runInAction(() => {
			this.spanValues = sum ?? {};
		});
		await this.loadDayValues();
	}

	prevTimeSpan = async () => {
		this.timeSpan.prev();
		await this.loadSum();
	}

	nextTimeSpan = async () => {
		this.timeSpan.next();
		await this.loadSum();
	}

	get historyItems():PageItems<any> {return this.historyPageItems;}
	field:string;

	async startFieldHistory(item: any, field:string) {
		this.item = item;
		this.field = field;
		await this.midIDX.init();
		//await this.setTimeSpan('year');
		let timeSpan = TimeSpan.create('year');
		this.historyPageItems.first({
			id: this.item.id,
			far: timeSpan.far,
			near: 1817507137000, //this.timeSpan.near,
			field
		});
	}

	renderFieldHistory() {
		return this.renderView(VHistory);
	}

	async showFieldHistory(field:string) {
		await this.startFieldHistory(this.item, field);
		this.openVPage(VHistoryPage);
	}

	async loadDayValues() {
		let {far, near} = this.timeSpan;
		let ret = await this.midIDX.loadDayValues(this.item.id, this.field, far, near);
		let dayValues = this.timeSpan.getDayValues(ret);
		runInAction(() => {
			this.dayValues = dayValues;
		});
	}

	setCurrentField(field:string) {
		this.field = field;
		this.loadDayValues();
	}

	async saveFieldValue(field:string, t:number, value:number|string) {
		let {id} = this.item;
		await this.midIDX.saveFieldValue(id, field, t, value);
		let ret = await this.midIDX.loadFieldSum(id, field, this.timeSpan);
		let v= ret[field];
		this.spanValues[field] = v;
		return;
	}
}
