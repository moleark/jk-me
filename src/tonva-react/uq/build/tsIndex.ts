import { buildTsHeader } from "./tools";

export function buildTsIndex():string {
	return `${buildTsHeader()}
export { CUqApp, CUqBase, CUqSub } from './CBase';
export { CApp } from './CApp';
export * from './uqs';
export * from './App';
`;
}
