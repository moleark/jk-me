import { FA, LMR, VPage } from "tonva-react";
import { CBug, DebugItem } from "./CBug";

export class VBug extends VPage<CBug> {
	header() {
		return <div className="px-3">
			Debug
			<small className="text-muted"> - 本页仅调试状态可见</small>
		</div>
	}
	content() {
        return <div>
			<div>
				{this.controller.debugItems.map(this.renderItem)}
			</div>
			<div className="px-3 py-2">
				<button className="btn btn-primary" onClick={this.controller.test}>test</button>
			</div>
		</div>;
	}

	private renderItem = (item:DebugItem, index:number):JSX.Element => {
		let {name, discription} = item;
		let right = <FA name="angle-right" />;
		return <LMR key={index} className="px-3 py-2 cursor-pointer mt-1 bg-white"
			onClick={() => this.controller.openDebugPage(item)}
			right={right}>
			<div>{name} <small className="text-muted">{discription}</small></div>
		</LMR>;
	}
}