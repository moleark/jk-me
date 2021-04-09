import { PageItems } from "tonva-react";
import { IDBase } from "../base";

export type IDItemsPageLoader<T> = (pageStart:any, pageSize:number) => Promise<T[]>;
export type HistoryPageLoader<T> = (id:number, field:string, far:number, near:number, pageStart:any, pageSize:number) => Promise<T[]>;

export abstract class ListPageItems<T> extends PageItems<T> {
	private pageLoader: IDItemsPageLoader<T>;
	constructor(pageLoader: IDItemsPageLoader<T>) {
		super(true);
		this.pageLoader = pageLoader;
	}

	async loadResults(param:any, pageStart:any, pageSize:number): Promise<{[name:string]:any[]}> {
		let ret = await this.pageLoader(pageStart, pageSize);
		return {$page:ret};
	}

	abstract update(item: T): Promise<void>;
}

export class HistoryPageItems<T extends IDBase> extends PageItems<T> {
	private pageLoader: HistoryPageLoader<T>;
	constructor(pageLoader: HistoryPageLoader<T>) {
		super(true);
		this.pageLoader = pageLoader;
	}

	async loadResults(param:any, pageStart:any, pageSize:number): Promise<{[name:string]:any[]}> {
		let {id, field, far, near} = param;
		let ret = await this.pageLoader(id, field, far, near, pageStart, pageSize);
		return {$page:ret};
	}

	update(item: T): Promise<void> {return;}
}
