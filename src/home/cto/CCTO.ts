import { AccountController, CHome } from "../CHome";
import { CApp, CUqSub, UQs } from "uq-app";
import { VItem } from "./VItem";
import { VValuePage } from "./VValuePage";
import { makeObservable, observable } from "mobx";

export class CCTO extends CUqSub<CApp, UQs, CHome> implements AccountController {
	value: number = null;
	constructor(cHome: CHome) {
		super(cHome);
		makeObservable(this, {
			value: observable,
		})
	}

	protected async internalStart() {
		this.openVPage(VValuePage);
	}

	renderItem() {
		return this.renderView(VItem);
	}

	async loadItem(): Promise<void> {
		this.value = 5;
	}
}
