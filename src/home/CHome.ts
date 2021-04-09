import { makeObservable, observable } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { AccountType } from "uq-app/uqs/JkMe";
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
		let ret = await this.uqs.JkMe.ID<AccountType>({
			IDX: [this.uqs.JkMe.AccountType],
			id: undefined,
		});
		this.accountControllers = ret.map(v => {
			switch(v.type) {
				case 'cto': return this.newSub(CCTO);
				case 'contentmanager': return this.newSub(CContentManager);
			}
		});
		await Promise.all(this.accountControllers.map(v => v.loadItem()));
	}
}

