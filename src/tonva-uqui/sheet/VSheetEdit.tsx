import { FA, List, LMR, Page, VPage } from "tonva-react";
import { CSheet } from "./CSheet";

export class VSheetEdit extends VPage<CSheet<any, any>> {
	header() {return 'sheet';}
	right() {
		return <button className="btn btn-primary btn-sm mr-2"
			onClick={this.saveSheet}>
			整单完成
		</button>;
	}
	content() {
		let {midSheet: mid, master, details} = this.controller;
		let {ID} = mid.master;
		let right = <button className="btn btn-success btn-sm"
			onClick={() => this.controller.editDetail(undefined)}>
			<FA name="plus" />
		</button>;
		return <div className="my-3">
			<div className="p-3">
				{ID.render(master)}
			</div>
			<div className="mt-3 pb-1 mb-1 px-3 small text-muted border-bottom">
				<LMR right={right} className="align-items-end">明细</LMR>
			</div>
			<List items={details} item={{render: this.renderDetail, onClick: this.onDetailClick}} />
		</div>;
	}

	private onDetailClick = (item: any) => {
		this.controller.editDetail(item);
	}

	private renderDetail = (item:any, index:number) => {
		return <div className="px-3 py-2">
			{this.controller.midSheet.detail.ID.render(item)}
		</div>
	}
//	{JSON.stringify(item)}

	private saveSheet = async () => {
		let ret = await this.controller.saveSheet();
		this.closePage();
		this.openPageElement(<Page header="单据完成">
			<div className="p-3 text-center">
				<div className="my-3">单据保存成功！</div>
				<div className="my-3">{ret.master}</div>
				<button className="btn btn-primary" onClick={()=>this.closePage()}>返回</button>
			</div>
		</Page>)
	}
}
