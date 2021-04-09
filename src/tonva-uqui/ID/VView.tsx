import { observer } from "mobx-react";
import { FA, PropGrid, View, VPage } from "tonva-react";
import { CID } from "./CID";

export class VView extends VPage<CID<any>> {
	header() {return this.controller.midID.itemHeader}
	right() {
		return this.controller.renderViewRight();
		/*
		return <button
			className="btn btn-sm btn-primary mr-2" 
			onClick={() => this.controller.onItemEdit()}>
			<FA name="pencil-square-o" />
		</button>;
		*/
	}
	content() {
		let V = observer(() => {
			let {item, midID} = this.controller;
			let {props} = midID;
			return <div className="py-3">
				<PropGrid rows={props}
					values={item} />
			</div>;	
		});
		return <V />;
	}
}

export class VViewRight extends View<CID<any>> {
	render() {
		return <button
			className="btn btn-sm btn-primary mr-2" 
			onClick={() => this.controller.onItemEdit()}>
			<FA name="pencil-square-o" />
		</button>;
	}
}
