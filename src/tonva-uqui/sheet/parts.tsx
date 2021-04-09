import { ID } from "tonva-react";
import { Detail, Master } from "../base";

export function renderMaster<M extends Master>(IDMaster:ID, master: M):JSX.Element {
	return IDMaster.render(master);
}

export function renderDetail<D extends Detail>(IDDetail:ID, detail: D):JSX.Element {
	return IDDetail.render(detail);
}

