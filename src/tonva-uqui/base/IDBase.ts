//import { ID } from "tonva-react";

export interface IDBase {
	id?: number;
}

export interface IXBase extends IDBase {
	ix: number;
	xi: number;
}

export interface Master {
	id?: number;
}

export interface Detail {
	id?: number;
	master?: number;
	row?: number;
}
