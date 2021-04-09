import { Controller, nav, Uq } from "tonva-react";
import { VRoles } from "./VRoles";
import { CRoleAdmin } from './roleAdmin';

const roleCaptionMap:{[role:string]: string} = {
	accountant: '会计',
	manager: '经理',
}

export class CRoles extends Controller {
	private uq: Uq;
	roles: string[] = null;
	constructor(uq:Uq) {
		super();		
		this.uq = uq;
	}

	protected async internalStart() {
		this.roles = await this.uq.$.getRoles();
		if (!this.roles) this.roles = [];
		this.openVPage(VRoles)
	}

	async showRoleAdmin() {
		let  uqMan = this.uq.$;
		let {allRoles} = uqMan;
		if (!allRoles || allRoles.length === 0) {
			alert(`uq ${uqMan.name} has not defined roles`);
			return;
		}
		let cRoleAdmin = new CRoleAdmin(this.uq, this.myRolesChanged, roleCaptionMap);
		cRoleAdmin.setRes(this.getRes());
		await cRoleAdmin.start();
	}

	private myRolesChanged = (roles:string[]) => {
		this.roles = roles;
		this.user.roles[this.uq.$.name] = roles;
		nav.saveLocalUser();
	}
}