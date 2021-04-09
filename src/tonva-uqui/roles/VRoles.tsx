import { observer } from "mobx-react";
import { FA, LMR, VPage } from "tonva-react";
import { CRoles } from "./CRoles";

interface RoleItem {
	caption: string;
	onClick: () => Promise<void>;
}

export class VRoles extends VPage<CRoles> {
	private onRoleAdmin = async () => {
		this.controller.showRoleAdmin();
	}
	private onAccountant = async () => {
		//this.openVPage(VAccountant);
	}

	private onManager = async () => {
		//this.openVPage(VManager);
	}
	private roleItems:{[role:string]: RoleItem} = {
		$: {
			caption: '设置用户角色',
			onClick: this.onRoleAdmin,
		},
		accountant: {
			caption: '会计',
			onClick: this.onAccountant,
		},
		manager: {
			caption: '经理',
			onClick: this.onManager,
		},
	};

	header() {
		return this.t('backend')
	}
	content() {
		let VContent = observer(() => {
			let {roles} = this.controller;
			return <div>
				<div>
					{roles.map(this.renderRoleItem)}
				</div>
			</div>;	
		});
		return <VContent />;
	}

	private renderRoleItem = (role:string, index:number):JSX.Element => {
		let item = this.roleItems[role];
		if (!item) return null;
		let {caption, onClick} = item;
		let right = <FA name="angle-right" />;
		return <LMR key={index} className="px-3 py-2 cursor-pointer mt-1 bg-white"
			onClick={onClick}
			right={right}>
			<div>{caption}</div>
		</LMR>;
	}
}