import { buildTsHeader } from "./tools";

export function buildTsVMain() {
	return `${buildTsHeader()}
import { VPage, Page } from 'tonva-react';
import { CApp } from './CApp';

export class VMain extends VPage<CApp> {
	header() { return 'TEST'; }
	content() {
		return <div className="m-3">
			<div>{this.renderMe()}</div>
			<div className="mb-5">同花样例主页面</div>
		</div>;
	}
}
`;
}
