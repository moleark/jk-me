import { VPage } from "tonva-react";
import { CSelect } from "./CSelect";
import { Tag } from '../MidTag';
import { ItemTags } from '../CIDTagList';

interface TagGroup {
	id: number;
	name:string;
	checks: {tag: Tag, selected: boolean}[];
}

export class VSelect extends VPage<CSelect> {
	private tagGroups:TagGroup[];
	init() {
		let {midTag, itemTags} = this.controller;
		let {typeColl} = itemTags as ItemTags<any>;
		this.tagGroups = [];
		for (let midType of midTag.typeArr) {
			let {id, name} = midType;
			let type = typeColl[id];
			let checks: {tag:Tag; selected: boolean}[] = [];
			let tagGroup = {id, name, checks};
			for (let s of midType.sub) {
				let {id: tagId} = s;
				let selected = 
					type === undefined?
					false
					:
					type.sub.findIndex(v => v.id === tagId) >= 0;
				checks.push({tag:s, selected});
			}
			this.tagGroups.push(tagGroup);
		}
	}

	header() {return 'select'}
	content() {
		let {midTag, itemTags} = this.controller;
		let {item} = itemTags;
		//let {tags} = midTag;
		return <div className="px-3">
			<div className="my-3">{midTag.ID.render(item)}</div>
			{this.tagGroups.map(v => this.renderType(v))}
		</div>;
	}

	private renderType(group: TagGroup) {
		let {id, name, checks}  = group;
		return <div key={id} className="my-3">
			<div><b>{name}</b></div>
			<div className="form-check form-check-inline mt-1">
			{checks.map(v => {
				let {tag, selected} = v;
				let {id, name} = tag;
				return <>
					<label key={id} className="form-check-label mr-3">
					<input type="checkbox" className="form-check-input"
						onChange={(evt) => this.controller.onTagSelectChanged(tag, evt.currentTarget.checked)}
						defaultChecked={selected} />
					{name}</label>
				</>
			})}
			</div>
		</div>
	}
}