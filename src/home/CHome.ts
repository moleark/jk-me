import { makeObservable, observable } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { Account, AccountType } from "uq-app/uqs/JkMe";
import { CContentManager } from "./contentManager";
import { CCTO } from "./cto";
import { VHome } from "./VHome";

export interface AccountController {
	start(): Promise<void>;
	loadItem(): Promise<void>;
	renderItem():JSX.Element;	
}

export class CHome extends CUqBase {
	//accountTypes: AccountType[];
	//cCTO: CCTO;
	accountId: number;
	accountControllers: AccountController[];

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			accountControllers: observable
		});
		//this.cCTO = this.newSub(CCTO);
	}

	protected async internalStart() {
	}

	tab = () => this.renderView(VHome);

	load = async () => {
		let me = this.uqs.JkMe;
		let ret = await Promise.all([
			me.QueryID<Account>({
				IDX: [me.Account],
				keyx: {user:undefined, accounType: undefined},
			}),
			me.QueryID<AccountType>({
				IX: [me.UserAccountType],
				IDX: [me.AccountType],
				ix: undefined,
			}),
		]);
		let account = ret[0];
		let accounType = ret[1];

		this.accountId = account[0]?.id;
		this.accountControllers = accounType.map(v => {
			switch(v.type) {
				default:
				case 'cto': return this.newSub(CCTO);
				case 'contentmanager': return this.newSub(CContentManager);
			}
		});
		await Promise.all(this.accountControllers.map(v => v.loadItem()));

/*
		await me.Acts({
			accountCTO: [{
				id: this.accountId,
				orderAmount: 3,
			}],
		});
*/
	}
}

