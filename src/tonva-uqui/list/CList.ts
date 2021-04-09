import { Controller } from "tonva-react";
import { renderItem, listRight, renderItemContainer } from "../tools";
import { ListPage, ListPageProps } from "./ListPage";
import { MidList } from "./MidList";

export class CList<T> extends Controller {
	protected readonly midList: MidList<T>;
	protected selectedItem: T;
	protected listPageProps: ListPageProps;
	constructor(midList: MidList<T>) {
		super();
		this.setRes(midList.res);
		this.midList = midList;
	}

	async init() {
		await this.midList.init();
		let pageItems = this.midList.pageItems;
		let props:ListPageProps = {
			header: this.header,
			pageItems,
			key: this.midList.key,
			itemClick: (item:any) => this.onItemClick(item),
			right: this.renderRight(),
			renderItem: (item:any, index) => this.renderItem(item, index),
			renderItemContainer: (content:any) => this.renderItemContainer(content),
		};
		pageItems.first(this.firstParam);
		this.listPageProps = props;
	}

	protected async internalStart() {
		await this.init();
		let page = new ListPage(this.listPageProps);
		this.openPage(page.render(), () => this.returnCall(this.selectedItem));
	}

	protected get firstParam():any {return undefined;}
	protected get header():string|JSX.Element {return this.midList.header ?? 'List'}
	protected renderItemContainer(content:any):JSX.Element {
		return renderItemContainer(content);
	}
	protected onItemClick(item:any):void {
		this.midList.onItemClick(item);
	}

	protected renderRight():JSX.Element {		
		let {renderRight, onRightClick} = this.midList;
		if (!onRightClick) return null;
		return (renderRight ?? listRight)(onRightClick);
	}

	protected renderItem(item:any, index:number):JSX.Element {
		return (this.midList.renderItem ?? renderItem)(item, index);
	}

}
