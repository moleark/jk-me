import { TFunc } from "../res";
import { Entity } from "./entity";
import { Render, UI } from '../ui';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class IDXEntity<M> extends Entity {
	readonly ui: UI;
	readonly render: Render<M>;
	readonly t: TFunc;
}

export class UqID<M> extends IDXEntity<M> {
	get typeName() {return 'id'}
	create: boolean;
	update: boolean;
	owner: boolean;
	async NO(): Promise<string> {
		let ret = await this.uqApi.post('id-no', {ID:this.name});
		return ret;
	};
}

export class ID extends UqID<any> {	
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class UqIDX<M> extends IDXEntity<M> {
	get typeName() {return 'idx'}
}

export class IDX extends UqIDX<any> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class UqIX<M> extends IDXEntity<M> {
	get typeName() {return 'ix'}
}

export class IX extends UqIX<any> {
}

/* eslint-enable no-unused-vars */
