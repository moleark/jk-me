import { ID, Schema, UiSchema, Uq, Prop, IDX } from "tonva-react";
import { TimeSpan } from "../tools";
import { Mid } from "../base";

export class MidIDX extends Mid {
	readonly IDX: IDX;
	readonly ID: ID;
	readonly timeZone: number;
	constructor(uq: Uq, IDX: IDX, ID: ID, timeZone:number) {
		super(uq);
		this.IDX = IDX;
		this.ID = ID;
		this.timeZone = timeZone;
	}
	
	async init():Promise<void> {
		await this.loadSchema();
	}

	protected async loadSchema() {
		await Promise.all([
			this.IDX.loadSchema(),
			this.ID.loadSchema(),
		]);
		let IDUI = {ID: this.ID};
		this._itemSchema = await this.buildItemSchema(IDUI);
		this._uiSchema = this.buildUISchema(IDUI);
		this._props = this.buildGridProps(this.IDX);
		let {exFields} = this.IDX.schema;
		for (let prop of this._props) {
			let {name} = prop as any;
			if (!name) continue;
			let ex = (exFields as any[])?.find(v => v.field === name);
			let time = ex?.time;
			if (!time) continue;
			(prop as any).time = time;
		}

	}

	async load(id:number): Promise<any[]> {
		let ret = await this.uq.ID({
			IDX: [this.ID, this.IDX],
			id,
			page: undefined,
		});
		return ret;
	}

	historyLoader = async (id:number, field:string, far:number, near:number, pageStart:any, pageSize:number):Promise<any[]> => {
		let ret = await this.uq.IDLog({
			IDX: this.IDX,
			field,
			id,
			log: 'each',
			far,
			near,
			page: {
				start: pageStart,
				size: pageSize,
			}
		});
		return ret;
	}

	async saveID(data:any):Promise<number> {
		let param: any = {};
		param[this.ID.name] = [data];
		let ret = await this.uq.Acts(param);
		let id = ret[this.ID.name];
		return id[0];
	}

	async saveFieldValue(id:number, fieldName:string, t:any, value:string|number):Promise<void> {
		let param: any = {};
		let val: any = {id};
		val[fieldName] = {
			$time: t,
			value,
		}
		param[this.IDX.name] = [val];
		let ret = await this.uq.Acts(param);
		return ret;
	}

	async loadFieldSum(id:number, field:string, timeSpan:TimeSpan):Promise<any> {
		let {far, near} = timeSpan;
		let retSum = await this.uq.IDSum({
			IDX: this.IDX,
			field: [field],
			id,
			far,
			near,
		});
		let ret = retSum[0];
		return ret;
	}

	async loadSum(id:number, far:number, near:number):Promise<[any[], any[]]> {
		let valueFields:string[] = [];
		let {fields, exFields} = this.IDX.schema;
		if (exFields === undefined) {
			throw new Error('no valid sum field in exFields');
		}
		for (let ex of exFields) {
			let {field, log} =  ex;
			if (log !== true) continue;
			let f = (fields as any[]).find(v => v.name === field);
			if (f === undefined) continue;
			let {name, type} = f;
			if (['int', 'tinyint', 'smallint', 'bigint', 'dec', 'float', 'double'].indexOf(type) < 0) continue;
			valueFields.push(name);
		}
		return await Promise.all([
			this.uq.ID({
				IDX: this.IDX,
				id,
			}),
			this.uq.IDSum({
				IDX: this.IDX,
				field: valueFields,
				id,
				far,
				near,
			}),
		]);
	}

	async loadDayValues(id:number, field: string, far:number, near:number):Promise<any[]> {
		if (!field) {
			field = (this._props[0] as any)?.name;
			if (!field) {
				debugger;
				alert('no field in loadDayValues');
			}
		}
		let ret = await this.uq.IDLog({
			IDX: this.IDX,
			field,
			log: 'day',
			timeZone: this.timeZone,
			id,
			far,
			near,
			page: {
				start: near,
				end: far,
				size: 100,
			}
		});
		return ret;
	}

	private _itemSchema: Schema;
	get itemSchema(): Schema { return this._itemSchema; }

	private _uiSchema: UiSchema;
	get uiSchema(): UiSchema { return this._uiSchema; }

	private _props: Prop[];
	get props():Prop[] { return this._props; }
}
