import React from "react";
import { observer } from "mobx-react";
import { List, VPage } from "tonva-react";
import { AccountController, CHome } from "./CHome";
import '../App.css';

export class VHome extends VPage<CHome> {
	header() {return '首页'}
	content() {
		return React.createElement(observer(() => {
			return <div className="">
				<List items={this.controller.accountControllers} 
					item={{render: this.renderAccountType, onClick: this.onClickAccountType}} />
			</div>;
		}));
	}

	private renderAccountType = (accountController: AccountController, index: number) => {
		return accountController.renderItem();
	}

	private onClickAccountType = async (accountController: AccountController) => {
		await accountController.start();
	}
}