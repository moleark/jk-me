import { makeObservable, observable, runInAction } from "mobx";
import { centerApi, Controller, UqApi, Uq } from "tonva-react";
import { CIXEdit, MidIX } from "../../IX";
import { VRoleAdmin } from "./VRoleAdmin";

export interface UserRole {
	user:number; 
	roles:boolean[];
	isDeleted?: boolean;
}

export class CRoleAdmin extends Controller {
	private readonly uq:Uq;
	private readonly uqApi: UqApi;
	readonly allRoles: string[];
	readonly roleCaptions: string[];
	meRoles: UserRole = null;
	userRoles: UserRole[] = null;
	ixOfUsers: string[];
	private myRolesChanged:(roles:string[])=>void;

	constructor(uq:Uq, myRolesChanged?:(roles:string[])=>void, roleCaptionMap?:{[role:string]:string}) {
		super();
		makeObservable(this, {
			meRoles: observable,
			userRoles: observable,
		});
		this.uq = uq;
		let {$:uqMan} = uq;
		this.uqApi = uqMan.uqApi;
		this.allRoles = uqMan.allRoles;
		if (!this.allRoles || this.allRoles.length === 0) {
			throw new Error(`uq ${uqMan.name} allRoles not defined. No RoleAdmin needed.`);
		}
		this.myRolesChanged = myRolesChanged;
		if (roleCaptionMap) {
			this.roleCaptions = this.allRoles.map(v => roleCaptionMap[v] || v);
		}
		else {
			this.roleCaptions = this.allRoles;
		}
	}

	protected async internalStart() {
		let allUserRoles = await this.uqApi.getAllRoleUsers();
		runInAction(() => {
			let r0 = allUserRoles.shift();
			let {roles} = r0;
			if (roles) {
				this.ixOfUsers = roles.split('|');
			}
			let arr:string[] = this.allRoles.map(v => `|${v}|`);
			function rolesBool(t:string): boolean[] {
				if (!t) return arr.map(v => false);
				return arr.map(v => t.indexOf(v) >= 0);
			}
			this.userRoles = [];
			let meId = this.user.id;
			for (let ur of allUserRoles) {
				let {user, roles} = ur;
				let item:UserRole = ur as any;
				item.roles = rolesBool(roles);
				if (user === meId)
					this.meRoles = item;
				else
					this.userRoles.push(item);
			}
		});
		this.openVPage(VRoleAdmin);
	}
	async setUserRole(checked:boolean, iRole:number, userRole:UserRole) {
		let {roles} = userRole;
		let len = roles.length;
		let text:string = '';
		for (let i=0; i<len; i++) {
			let yes = i===iRole? checked : roles[i];
			if (yes === true) text += '|' + this.allRoles[i];
		}
		text += '|';
		await this.uqApi.setUserRoles(userRole.user, text);
		roles[iRole] = checked;
		this.fireMyRolesChanged(userRole);
	}

	private fireMyRolesChanged(userRole: UserRole, newRoles?:boolean[]) {
		if (!this.myRolesChanged) return;
		if (userRole !== this.meRoles) return;
		let {roles} = userRole;
		if (newRoles) roles = newRoles;
		let roleNames:string[] = ['$'];
		for (let i=0; i<roles.length; i++) {
			if (roles[i] === true) roleNames.push(this.allRoles[i]);
		}
		this.myRolesChanged(roleNames);
	}

	private buildRolesText(userRole:UserRole) {
		let ret = userRole.roles.map((v, index) => v===true? this.allRoles[index]:'').join('|');
		return `|${ret}|`;
	}

	async newUser(userName: string): Promise<string> {
		let ret = await centerApi.userFromKey(userName);
		if (!ret) {
			return '这个用户名没有注册';
		}
		let user = ret.id;
		let roles: string;
		if (this.isMe(user) === true) {
			if (this.meRoles) {
				this.meRoles.isDeleted = false;
			}
			else {
				this.meRoles = {
					user,
					roles:  this.allRoles.map(v => false)
				};	
			}
		}
		else {
			let userRole = this.userRoles.find(v => v.user === user);
			if (userRole) {
				if (userRole.isDeleted === true) {
					userRole.isDeleted = false;
					roles = this.buildRolesText(userRole);
				}
				else {
					return '这个用户已经是角色用户了';
				}
			}
			else {
				userRole = {
					user,
					roles: this.allRoles.map(v => false),
				};
				this.userRoles.push(userRole);
				roles = '';
			}
		}
		await this.uqApi.setUserRoles(user, roles);
		if (this.isMe(user) === true) {
			this.fireMyRolesChanged(this.meRoles);
		}
	}

	async deleteUser(userRole: UserRole) {
		let {user} = userRole;
		userRole.isDeleted = true; 
		await this.uqApi.deleteUserRoles(user);
		this.fireMyRolesChanged(userRole, this.allRoles.map(v => false));
	}

	async restoreUser(userRole: UserRole) {
		let {user} = userRole;
		userRole.isDeleted = false; 
		let roles = this.buildRolesText(userRole)
		await this.uqApi.setUserRoles(user, roles);
		this.fireMyRolesChanged(userRole);
	}

	ixUserBind = async (user:number, ixName:string) => {
		let IX = this.uq.$.getIX(ixName);
		await IX.loadSchema();
		let {id2Name} = IX.schema;
		let ID = this.uq.$.getID(id2Name);
		let midIX = new MidIX(this.uq, IX, ID, user);
		let cIXEdit = new CIXEdit(midIX);
		await cIXEdit.start();
	}
}
