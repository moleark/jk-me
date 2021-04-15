import { AccountController, CHome } from "../CHome";
import { CApp, CUqSub, UQs } from "uq-app";
import { AccountCTO } from 'uq-app/uqs/JkMe';
import { VItem } from "./VItem";
import { VValuePage } from "./VValuePage";
import { action, makeObservable, observable, runInAction } from "mobx";
import { CID, CIDX, MidIDX, MidIDXList, TimeSpan } from "tonva-uqui";
import { CList } from "tonva-uqui/list";

export class CCTO extends CUqSub<CApp, UQs, CHome> implements AccountController {
	value: number = null;
	orderAmountDay: number = null;
	orderAmountWeek: number = null;
	orderAmountMonth: number = null;
	//orderAmountYear: number = null;
	allValuesLoaded: boolean = false;
	constructor(cHome: CHome) {
		super(cHome);
		makeObservable(this, {
			loadItem: action,
			orderAmountDay: observable,
			orderAmountMonth: observable,
			//orderAmountYear: observable,
			allValuesLoaded: observable,
		})
	}

	protected async internalStart() {
		this.allValuesLoaded = false;
		this.openVPage(VValuePage);
		await this.loadItem();
		this.allValuesLoaded = true;
	}

	renderItem() {
		return this.renderView(VItem);
	}

	async loadItem(): Promise<void> {
		let timeSpanDay = TimeSpan.create('day');
		let timeSpanWeek = TimeSpan.create('week');
		let timeSpanMonth = TimeSpan.create('month');
		//let timeSpanYear = TimeSpan.create('year');
		let me = this.uqs.JkMe;
		let id = this.owner.accountId;
		let ret = await Promise.all([
			me.IDSum<AccountCTO>({
				IDX: me.AccountCTO,
				field: ['orderAmount'],
				id,
				far: timeSpanDay.far,				// 以前
				near: timeSpanDay.near,				// 最近
			}),
			me.IDSum<AccountCTO>({
				IDX: me.AccountCTO,
				field: ['orderAmount'],
				id,
				far: timeSpanWeek.far,				// 以前
				near: timeSpanWeek.near,				// 最近
			}),
			me.IDSum<AccountCTO>({
				IDX: me.AccountCTO,
				field: ['orderAmount'],
				id,
				far: timeSpanMonth.far,				// 以前
				near: timeSpanMonth.near,				// 最近
			}),
			/*
			me.IDSum<AccountCTO>({
				IDX: me.AccountCTO,
				field: ['orderAmount'],
				id,
				far: timeSpanYear.far,				// 以前
				near: timeSpanYear.near,				// 最近
			}),
			*/
		]);
		runInAction(() => {
			this.orderAmountDay = ret[0][0]?.orderAmount;
			this.orderAmountWeek = ret[1][0]?.orderAmount;
			this.orderAmountMonth = ret[2][0]?.orderAmount;
			//this.orderAmountYear = ret[3][0]?.orderAmount;
		});
	}

	showIDX = async () => {
		let uq = this.uqs.JkMe;
		let mid = new MidIDX(uq, uq.AccountCTO, uq.Account, this.timeZone);
		let cIDX = new CIDX(mid);
		//await cIDX.start();
		let ret = await uq.
		await cIDX.showItemView();
		/*
		let midIDXList = new MidIDXList(uq, uq.Account, uq.AccountCTO);
		midIDXList.onItemClick = (item:any) => cIDX.start(item);
		let idList = new CList(midIDXList);
		await idList.start();
		*/
	}
}
