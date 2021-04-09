import { LocalMap, LocalCache, env } from '../tool';
import { UqData, UqAppData, CenterAppApi } from '../net';
import { UqMan } from './uqMan';
import { TuidImport, TuidInner } from './tuid';
import { nav } from '../components';
import { AppConfig, UqConfig } from '../app';

export interface TVs {
    [uqName:string]: {
        [tuidName: string]: (values: any) => JSX.Element;
    }
}

export class UQsMan {
	static _uqs: any;
	static value: UQsMan;

	static async build(appConfig: AppConfig) {
		let {app, uqs, tvs, version} = appConfig;
		let retErrors:string[];
		if (app) {
			let {name, version} = app;
			retErrors = await UQsMan.load(name, version, tvs);
		}
		else if (uqs) {
			retErrors = await UQsMan.loadUqs(uqs, version, tvs);
		}
		else {
			throw new Error('either uqs or app must be defined in AppConfig');
		}
		return retErrors;
	}

	// 返回 errors, 每个uq一行
	private static async load(tonvaAppName:string, version:string, tvs:TVs):Promise<string[]> {
		let uqsMan = UQsMan.value = new UQsManApp(tonvaAppName, tvs);
        let {appOwner, appName} = uqsMan;
        let {localData} = uqsMan;
        let uqAppData:UqAppData = localData.get();
        if (!uqAppData || uqAppData.version !== version) {
			uqAppData = await loadAppUqs(appOwner, appName);
			if (!uqAppData.id) {
				return [
					`${appOwner}/${appName}不存在。请仔细检查app全名。`
				];
			}
            uqAppData.version = version;
            localData.set(uqAppData);
            // 
            for (let uq of uqAppData.uqs) uq.newVersion = true;
        }
        let {id, uqs} = uqAppData;
		uqsMan.id = id;
		//console.error(uqAppData);
		//let ownerProfixMap: {[owner: string]: string};
		return uqsMan.buildUqs(uqs, version);
	}

	// 返回 errors, 每个uq一行
	private static async loadUqs(uqConfigs: UqConfig[], version:string, tvs:TVs):Promise<string[]> {
		let uqsMan = UQsMan.value = new UQsMan(tvs);
		let uqs = await loadUqs(uqConfigs);
		return uqsMan.buildUqs(uqs, version, uqConfigs);
	}

	private uqMans: UqMan[] = [];
    private collection: {[uqLower: string]: UqMan};
    private readonly tvs: TVs;

    protected constructor(tvs:TVs) {
        this.tvs = tvs || {};
		this.buildTVs();
		this.uqMans = [];
        this.collection = {};
    }

	private async buildUqs(uqDataArr:UqData[], version:string, uqConfigs?:UqConfig[]):Promise<string[]> {
        await this.init(uqDataArr);

		let localMap = env.localDb.map('$app');
		let localCacheVersion = localMap.child('version');
		let cacheVersion = localCacheVersion.get();
		if (version !== cacheVersion) {
			for (let uqMan of this.uqMans) {
				uqMan.localMap.removeAll();
			}
			localCacheVersion.set(version);
		}

        let retErrors = await this.load();
		if (retErrors.length > 0) return retErrors;
		retErrors.push(...this.setTuidImportsLocal());
		if (retErrors.length > 0) return retErrors;
		if (uqConfigs) {
			for (let uqConfig of uqConfigs) {
				let {dev, name, alias} = uqConfig;
				let {name:owner, alias:ownerAlias} = dev;
				let uqLower = (ownerAlias??owner).toLowerCase() + '/' + (alias??name).toLowerCase();
				let uq = this.collection[uqLower];
				uq.config = uqConfig;
			}
		}
		UQsMan._uqs = this.buildUQs();
	}

	static uq(uqName: string): UqMan {
		return UQsMan.value.collection[uqName.toLowerCase()];
	}
	
	static async getUqUserRoles(uqLower:string):Promise<string[]> {
		let uqMan = UQsMan.value.collection[uqLower];
		if (uqMan === undefined) return null;
		let roles = await uqMan.getRoles();
		return roles;
	}

    private buildTVs() {
		if (!this.tvs) return;
        for (let i in this.tvs) {
            let uqTVs = this.tvs[i];
            if (uqTVs === undefined) continue;
            let l = i.toLowerCase();
            if (l === i) continue;
            this.tvs[l] = uqTVs;
            for (let j in uqTVs) {
                let en = uqTVs[j];
                if (en === undefined) continue;
                let lj = j.toLowerCase();
                if (lj === j) continue;
                uqTVs[lj] = en;
            }
        }
    }

    async init(uqsData:UqData[]):Promise<void> {
        let promiseInits: PromiseLike<void>[] = uqsData.map(uqData => {
			let {uqOwner, ownerAlias, uqName, uqAlias} = uqData;
			if (uqAlias) uqName = uqAlias;
			if (ownerAlias) uqOwner = ownerAlias;
			let uqFullName = uqOwner + '/' + uqName;
			let uq = new UqMan(this, uqData, undefined, this.tvs[uqFullName] || this.tvs[uqName]);
			this.uqMans.push(uq);
			let lower = uqFullName.toLowerCase();
			this.collection[lower] = uq;
			return uq.init();
		});
        await Promise.all(promiseInits);
    }

    async load(): Promise<string[]> {
        let retErrors:string[] = [];
		let promises: PromiseLike<string>[] = [];
		//let lowerUqNames:string[] = [];
		// collection有小写名字，还有正常名字
        //for (let i in this.collection) {
		for (let uqMan of this.uqMans) {
			//let lower = (i as string).toLowerCase();
			//if (lowerUqNames.indexOf(lower) >= 0) continue;
			//lowerUqNames.push(lower);
            //let uq = this.collection[i];
            promises.push(uqMan.loadEntities());
		}
		let results = await Promise.all(promises);
        for (let result of results)
        {
            let retError = result; // await cUq.loadSchema();
            if (retError !== undefined) {
                retErrors.push(retError);
            }
		}
        return retErrors;
    }

    buildUQs(): any {
        //let that = this;
        let uqs:any = {};
        for (let uqMan of this.uqMans) {
            let uqKey = uqMan.getUqKey();
			let lower = uqKey.toLowerCase();
			let proxy = uqMan.createProxy();
			uqs[uqKey] = proxy;
			if (lower !== uqKey) uqs[lower] = proxy;
        }
        return new Proxy(uqs, {
            get: (target, key, receiver) => {
                let lk = (key as string).toLowerCase();
                let ret = target[lk];
                if (ret !== undefined) return ret;
                /*
                for (let i in uqs) {
                    if (i.toLowerCase() === lk) {
                        return uqs[i];
                    }
                }*/
                debugger;
                console.error('error in uqs');
                this.showReload(`新增 uq ${String(key)}`);
                return undefined;
            },
        });
	}
	
	getUqMans() {
		return this.uqMans;
	}

    private showReload(msg: string) {
		for (let uqMan of this.uqMans) {
			uqMan.localMap.removeAll();
		}
        nav.showReloadPage(msg);
    }

    setTuidImportsLocal():string[] {
        let ret:string[] = [];
        for (let uqMan of this.uqMans) {
            for (let tuid of uqMan.tuidArr) {
                if (tuid.isImport === true) {
                    let error = this.setInner(tuid as TuidImport);
                    if (error) ret.push(error);
                }
            }
        }
        return ret;
    }

    private setInner(tuidImport: TuidImport):string {
        let {from} = tuidImport;
        let fromName = from.owner + '/' + from.uq;
        let uq = this.collection[fromName];
        if (uq === undefined) {
            //debugger;
            return `setInner(tuidImport: TuidImport): uq ${fromName} is not loaded`;
        }
        let iName = tuidImport.name
        let tuid = uq.tuid(iName);
        if (tuid === undefined) {
            //debugger;
            return `setInner(tuidImport: TuidImport): uq ${fromName} has no Tuid ${iName}`;
        }
        if (tuid.isImport === true) {
            //debugger;
            return `setInner(tuidImport: TuidImport): uq ${fromName} Tuid ${iName} is import`;
        }
        tuidImport.setFrom(tuid as TuidInner);
    }
}

class UQsManApp extends UQsMan {
    readonly appOwner: string;
    readonly appName: string;
    readonly localMap: LocalMap;
    readonly localData: LocalCache;
    id: number;

	constructor(tonvaAppName:string, tvs:TVs) {
		super(tvs);
        let parts = tonvaAppName.split('/');
        if (parts.length !== 2) {
            throw new Error('tonvaApp name must be / separated, owner/app');
        }
        this.appOwner = parts[0];
        this.appName = parts[1];
        this.localMap = env.localDb.map(tonvaAppName);
        this.localData = this.localMap.child('uqData');
	}
}

async function loadAppUqs(appOwner:string, appName:string): Promise<UqAppData> {
    let centerAppApi = new CenterAppApi('tv/', undefined);
    let ret = await centerAppApi.appUqs(appOwner, appName);
    return ret;
}

async function loadUqs(uqConfigs: UqConfig[]): Promise<UqData[]> {
	let uqs: {owner:string; ownerAlias: string; name:string; alias:string; version:string}[] = uqConfigs.map(
		v => {
			let {dev, name, version, alias} =v;
			let {name:owner, alias:ownerAlias} = dev;
			return {owner, ownerAlias, name, version, alias};
		}
	);
    let centerAppApi = new CenterAppApi('tv/', undefined);
    let ret:UqData[] = await centerAppApi.uqs(uqs);
	for (let i=0; i<uqs.length; i++) {
		let {ownerAlias, alias} = uqs[i];
		ret[i].ownerAlias = ownerAlias;
		ret[i].uqAlias = alias;
	}
    return ret;
}
