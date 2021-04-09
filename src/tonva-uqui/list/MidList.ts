import { runInAction } from "mobx";
import { PageItems, Uq } from "tonva-react";
import { ListPageItems } from "../tools";
import { IDBase, Mid } from "../base";

export abstract class MidList<T> extends Mid {
	readonly pageItems: PageItems<T>;
	constructor(uq:Uq, res?:any) {
		super(uq, res);
		this.pageItems = this.createPageItems();
	}

	protected abstract createPageItems():PageItems<T>;
	async init():Promise<void> {}
	protected abstract loadPageItems(pageStart:any, pageSize:number):Promise<T[]>;
	key:((item:T) => number|string);

	onRightClick: ()=>any;
	renderItem: (item:T, index:number)=>JSX.Element;
	onItemClick: (item:T)=>any;
	renderRight: ()=>JSX.Element;
	header: string|JSX.Element;
	renderTop: () => JSX.Element;
	renderBottom: () => JSX.Element;
}

export abstract class MidIDListBase<T extends IDBase> extends MidList<T> {
	protected get listPageItems(): IDListPageItems<T> {return this.pageItems as IDListPageItems<T>}
	key:((item:T) => number|string) = item => {
		return item.id;
	}
	createPageItems():PageItems<T> {
		let loader = (pageStart:any, pageSize:number) => this.loadPageItems(pageStart, pageSize);
		return new IDListPageItems<T>(loader);
	}
}

export class IDListPageItems<T extends IDBase> extends ListPageItems<T> {
	itemId(item:T):number {return item.id}
	newItem(id:number, item:T):T {return {...item, id}}

	update(item:T): Promise<void> {
		let id = item.id;
		let ret = this._items.find(v => this.itemId(v) === id);
		if (ret === undefined) {
			let data = this.newItem(id, item);
			this._items.unshift(data);
		}
		else {
			runInAction(() => {
				Object.assign(ret, item);
			});
		}
		return;
	}
}
