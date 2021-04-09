import { VPage } from "tonva-react";
import { CID } from "./CID";

export class VEdit extends VPage<CID<any>> {
	header() {return  this.controller.editHeader}
	content() {
		let {cFormView, item} = this.controller;
		//let {IDUI} = midID;
		return <div className="p-3">
			{cFormView.renderForm(item)}
		</div>;
	}
}
