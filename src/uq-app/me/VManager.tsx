import { VPage } from "tonva-react";
import { CMe } from "./CMe";

export class VManager extends VPage<CMe> {
	header() {return '经理'}
	content() {
		return <div className="p-3">
			经理
		</div>
	}
}
