import { makeObservable, observable, runInAction } from "mobx";
import { Context, Controller } from "tonva-react";
import { renderItem } from "../tools";
import { IDBase } from "../base";
import { CList } from '../list';
import { CFormView, FormUI } from "../form";
import { MidID } from "./MidID";
import { MidIDList } from "./MidIDList";
import { VEdit } from "./VEdit";
import { VContent, VViewRight } from "./VContent";
import { res } from "./res";

export class CID<T extends IDBase> extends Controller {
	item:T = null;
	midID: MidID<T>;
	cFormView: CFormView<T>;
	private cList: CList<T>;
	private midIDList: MidIDList<T>;
	private valueChanged: boolean;

	constructor(midID: MidID<T>) {
		super();
		makeObservable(this, {
			item: observable,
		});
		this.setRes(res);
		this.setRes(midID.res);
		this.midID = midID;
	}

    protected async beforeStart():Promise<boolean> {
		await this.midID.init();
		this.createFormView();
		this.midIDList =  this.midID.createMidIDList();
		this.midIDList.onRightClick = this.onItemNew;
		this.midIDList.renderItem = this.renderItem;
		this.midIDList.onItemClick = this.onItemClick;
		this.midIDList.renderRight = this.renderListRight;
		this.midIDList.renderTop = this.renderListTop;
		this.midIDList.renderBottom = this.renderListBottom;
		this.cList = this.createCList();
        return true;
	}

	protected async internalStart() {
		this.valueChanged = false;
		await this.cList.call();
		this.returnCall(this.valueChanged);
	}

	protected createFormView() {
		let {ID, IDUI} = this.midID;
		let {fieldCustoms} = IDUI;
		let formUI = new FormUI(ID.ui, fieldCustoms, ID.t);
		this.cFormView = new CFormView(formUI);
		this.cFormView.onSubmit = this.onSubmit;
	}

	protected createCList() {
		return new CList(this.midIDList);
	}

	protected renderListRight: () => JSX.Element;
	protected renderListTop: () => JSX.Element;
	protected renderListBottom: () => JSX.Element;

	private onSubmit = async (name:string, context: Context) => {
		await this.saveID(context.data);
		this.closePage();
	}

	renderItem: (item:T, index:number) => JSX.Element = (item:T, index:number) => {
		let {ID } = this.midID;
		if (ID) return ID.render(item);
		return renderItem(item, index);
	}
	onItemClick: (item: T) => void = (item:any) => {
		runInAction(() => {
			this.item = item;
			this.onItemView();
		});
	}

	onItemEdit = async (): Promise<void> => {
		this.valueChanged = false;
		await this.midID.init();
		this.createFormView();
		this.openVPage(VEdit);
	}

	async onItemView():Promise<void> {
		this.openVPage(VContent);
	}

	onItemNew = async (): Promise<void> => {
		await this.cFormView.setNO(this.midID.ID);
		runInAction(() => {
			this.item = undefined;
			this.openVPage(VEdit);
		});
	}

	async saveID(itemProps:any) {
		let id = this.item?.id;
		let item = {
			...itemProps,
			id,
		}
		let ret = await this.midID.saveID(item);
		if (ret) id = ret;
		this.midIDList?.update(id, item);
		runInAction(() => {
			if (this.item)
				Object.assign(this.item, item);
			else
				this.item = item;
		});
		this.valueChanged = true;
		return ret;
	}

	get itemHeader() {
		return (this.midID.itemHeader as string ?? this.midID.ID.ui.label as string)
	}

	get editHeader() {
		return this.t(this.item? 'edit' : 'new') + ' ' + this.itemHeader;
	}

	renderViewRight(item?: T) {
		if (item) this.item = item;
		return this.renderView(VViewRight);
	}
}
