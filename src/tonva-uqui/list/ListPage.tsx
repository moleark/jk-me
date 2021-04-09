import { List, Page, PageItems, Scroller } from "tonva-react";

export interface ListPageProps {
	pageItems: PageItems<any>;
	itemClick: (item:any) => any;
	renderItem?: (item:any, index:number) => JSX.Element;
	renderItemContainer?: (content:any) => JSX.Element;
	key: (item:any) => number|string;
	header: JSX.Element | string;
	right?: JSX.Element;
	footer?: JSX.Element;
	top?: JSX.Element;
	bottom?: JSX.Element;
	back?: 'close' | 'back' | 'none';
	className?: string;
	headerClassName?: string;
}

export class ListPage extends Page {
	protected listPageProps: ListPageProps;
	constructor(listPageProps: ListPageProps) {
		super({});
		this.listPageProps = listPageProps;
	}

	render() {
		return this.renderPage();
	}

	private renderPage():JSX.Element {
		let {pageItems, itemClick, renderItem, renderItemContainer
			, key, header, footer, right
			, top, bottom, back, className, headerClassName} = this.listPageProps;
		if (!header) header = false as any;
		let renderRow = (item:any, index:number) => {
			return renderItemContainer(renderItem(item, index));
		}
		let item = {
			render: renderRow,
			onClick: itemClick,
			key,
		}
		return <Page
			header={header} right={right} footer={footer}
			onScroll={(e:any)=>this.onPageScroll(e)}
			onScrollTop={(scroller: Scroller) => this.onPageScrollTop(scroller)}
			onScrollBottom={(scroller: Scroller) => this.onPageScrollBottom(scroller)}
			back={back}
			headerClassName={headerClassName}
			className={className}
			afterBack={()=>this.afterBack()}
		>
			{top}
			<List items={pageItems} item={item} />
			{bottom}
		</Page>;
	}

	protected onPageScroll(e:any) {}
	protected async onPageScrollTop(scroller: Scroller): Promise<boolean> {return false;}
	protected async onPageScrollBottom(scroller: Scroller): Promise<void> {return;}
	protected afterBack():void {}
}
