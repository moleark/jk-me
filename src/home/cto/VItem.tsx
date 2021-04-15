import { observer } from "mobx-react";
import React from "react";
import { FA, View } from "tonva-react";
import { CCTO } from "./CCTO";

export class VItem extends View<CCTO> {
	render() {
		return React.createElement(observer(() => {
		let {orderAmountDay, orderAmountWeek, orderAmountMonth/*, orderAmountYear*/} = this.controller;
			function renderOrderAmount(amount:number, caption: string, color: string) {
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
					<div className={color}>{caption}订单</div>
					<div className="mt-2">
						<small className="text-muted">共</small> 
						<b className={'mx-2 ' + color}>{vAmount}</b>
						<small className="text-muted">元</small>
					</div>
				</div>;
			}
			return <div className="d-block pt-2">
				<div className="px-3 m-1">CTO</div>
				<div className="px-3 py-2 d-flex flex-wrap p-1">
					{renderOrderAmount(orderAmountDay, '日', 'text-danger')}
					{renderOrderAmount(orderAmountWeek, '周', 'text-primary')}
					{renderOrderAmount(orderAmountMonth, '月', 'text-success')}
				</div>
			</div>;
		}));
		//{renderOrderAmount(orderAmountYear, '年', 'text-info')}
	}
}