import _ from 'lodash';
import { Controller, WebNav } from "../vm";
import { CAppBase, IConstructor } from "./CAppBase";

export abstract class CBase<A extends CAppBase<U>, U> extends Controller {
    protected readonly _uqs: U;
    protected readonly _cApp: A;

    constructor(cApp: any) {
        super();
        this._cApp = cApp;
        this._uqs = cApp?.uqs;
	}

    get uqs(): U {return this._uqs}
	get cApp(): A {return this._cApp}
	async getUqRoles(uqName:string):Promise<string[]> {
		return this._cApp?.getUqRoles(uqName);
	}

	internalT(str:string):any {
		let r = super.internalT(str);
		if (r!==undefined) return r;
		return this._cApp.internalT(str);
	}

    protected newC<T extends CBase<A,U>>(type: IConstructor<T>, param?:any):T {
		let c = new type(this.cApp);
		c.init(param);
		return c;
    }

    newSub<O extends CBase<A,U>, T extends CSub<A,U,O>>(type: IConstructor<T>, param?:any):T {
		let s = new type(this);
		s.init(param);
		return s;
	}
	
	getWebNav(): WebNav<any> {
		let wn = this._cApp?.getWebNav();
		if (wn === undefined) return;
		let ret = _.clone(wn);
		_.merge(ret, this.webNav);
		return ret;
	}
}

export abstract class CSub<A extends CAppBase<U>, U, T extends CBase<A, U>> extends CBase<A,U> {
    protected _owner: T;

    constructor(owner: T) {
        super(owner.cApp);
        this._owner = owner;
	}

	internalT(str:string):any {
		let r = super.internalT(str);
		if (r!==undefined) return r;
		return this._owner.internalT(str);
	}

    protected get owner(): T {return this._owner}
	
	getWebNav(): WebNav<any> {
		let wn = this._cApp?.getWebNav();
		if (wn === undefined) return;
		let ownerWNs:WebNav<any>[] = [];
		for (let p = this.owner; p!==undefined; p = (p as any)?.owner) {
			ownerWNs.push(p.webNav);
		}
		let ret = _.clone(wn);
		for (;;) {
			let own = ownerWNs.pop();
			if (own === undefined) break;
			_.merge(ret, own);
		}
		_.merge(ret, this.webNav);
		return ret;
	}
}
