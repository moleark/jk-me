import { observer } from "mobx-react";
import React from "react";
import { FA, VPage } from "tonva-react";
import { CCTO } from "./CCTO";

export class VValuePage extends VPage<CCTO> {
	header() {return 'CTO'}
	content() {
		return React.createElement(observer(() => {
			let {allValuesLoaded, orderAmountDay, orderAmountMonth/*, orderAmountYear*/} = this.controller;
			if (allValuesLoaded === false) {
				return <div className="px-5 py-2">
					<FA name='spinner' spin={true} size="2x" className="text-info" />
				</div>;
			}
			function renderAmount(amount:number, caption: string, color: string) {
				let vAmount: any;
				if (amount === null) {
					vAmount = <FA name='spinner' spin={true} className="small text-info" />;
				}
				else if (amount === undefined) {
					vAmount = '-';
				}
				else {
					vAmount = amount;
				}
				return <div className="text-center border rounded m-1 px-2 py-3 w-min-12c">
					<div className={color}>{caption}</div>
					<div className="mt-2">
						<small className="text-muted">共</small> 
						<b className={'mx-2 ' + color}>{vAmount}</b>
						<small className="text-muted">元</small>
					</div>
				</div>;
			}
			function renderCaption(caption: string) {
				return <div className="px-3 pt-2 pb-1 border-bottom small text-muted bg-light">{caption}</div>;
			}
			return <div className="d-block pt-2 bg-white cursor-pointer" 
				onClick={this.controller.showIDX}>
				{renderCaption('订单')}
				<div className="px-3 py-2 d-flex flex-wrap p-1">
					{renderAmount(orderAmountDay, '日', 'text-danger')}
					{renderAmount(orderAmountMonth, '周', 'text-primary')}
					{renderAmount(orderAmountMonth, '月', 'text-success')}
				</div>
				{renderCaption('发货')}
				<div className="px-3 py-2 d-flex flex-wrap p-1">
					{renderAmount(orderAmountDay, '日', 'text-danger')}
					{renderAmount(orderAmountMonth, '周', 'text-primary')}
					{renderAmount(orderAmountMonth, '月', 'text-success')}
				</div>
				{renderCaption('收款')}
				<div className="px-3 py-2 d-flex flex-wrap p-1">
					{renderAmount(orderAmountDay, '日', 'text-danger')}
					{renderAmount(orderAmountMonth, '周', 'text-primary')}
					{renderAmount(orderAmountMonth, '月', 'text-success')}
				</div>
			</div>;
		}));
	}
}