import { Controller } from "tonva-react";
import { MidTag, Tag } from "../MidTag";
import { CIDTagList } from '../CIDTagList';
import { VSelect } from "./VSelect";

export class CSelect extends Controller {
	private cIDTagList: CIDTagList<any>;
	itemTags: any;
	midTag: MidTag;
	constructor(cIDTagList: CIDTagList<any>, itemTags:any, midTag: MidTag) {
		super();
		this.setRes(midTag.res);
		this.cIDTagList = cIDTagList;
		this.itemTags = itemTags;
		this.midTag = midTag;
	}

	protected async internalStart() {
		this.openVPage(VSelect);
	}

	protected onItemClick(item:any):void {
		return; //this.props.onItemClick(item);
	}

	protected renderRight():JSX.Element {
		return null;
	}

	onTagSelectChanged = async (tag:Tag, selected:boolean) => {
		await this.cIDTagList.onTagSelectChanged(this.itemTags, tag, selected);
	}
}
