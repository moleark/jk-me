//=== UqApp builder created on Fri Apr 09 2021 16:55:02 GMT-0400 (GMT-04:00) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqQuery, UqID, UqIDX, UqIX } from "tonva-react";


//===============================
//======= UQ 百灵威系统工程部/me ========
//===============================

export interface Tuid$sheet {
	no: string;
	user: number;
	date: any;
	sheet: number;
	version: number;
	flow: number;
	app: number;
	state: number;
	discription: string;
	data: string;
	processing: number;
}

export interface Tuid$user {
	name: string;
	nick: string;
	icon: string;
	assigned: string;
	poke: number;
}

export interface Param$poked {
}
interface Return$pokedRet {
	poke: number;
}
interface Result$poked {
	ret: Return$pokedRet[];
}

export interface $Piecewise {
	id?: number;
	name: string;
	mul: number;
	div: number;
	offset: number;
	asc: number;
}

export interface $PiecewiseDetail {
	id?: number;
	parent: number;
	row?: number;
	sec: number;
	value: number;
}

export interface AccountType {
	id?: number;
	type: string;
}

export interface Account {
	id?: number;
	user: number;
	$owner?: number;
	$create?: any;
}

export interface AccountCTO {
	id: number;
	commissionFormula?: number;
	orderAmount?: number;
	orderDeliver?: number;
	orderPaid?: number;
	amount?: number;
	$act?: number;
}

export interface ActParamAccountCTO {
	id: number|IDXValue;
	commissionFormula?: number|IDXValue;
	orderAmount?: number|IDXValue;
	orderDeliver?: number|IDXValue;
	orderPaid?: number|IDXValue;
	amount?: number|IDXValue;
	$act?: number;
}

export interface UserAccountType {
	ix: number;
	xi: number;
}

export interface ParamActs {
	$Piecewise?: $Piecewise[];
	$PiecewiseDetail?: $PiecewiseDetail[];
	accountType?: AccountType[];
	account?: Account[];
	accountCTO?: ActParamAccountCTO[];
	userAccountType?: UserAccountType[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$sheet: UqTuid<Tuid$sheet>;
	$user: UqTuid<Tuid$user>;
	$poked: UqQuery<Param$poked, Result$poked>;
	$Piecewise: UqID<any>;
	$PiecewiseDetail: UqID<any>;
	AccountType: UqID<any>;
	Account: UqID<any>;
	AccountCTO: UqIDX<any>;
	UserAccountType: UqIX<any>;
}
