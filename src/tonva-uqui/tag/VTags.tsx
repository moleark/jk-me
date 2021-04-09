import { LMR, VPage } from "tonva-react";
import { CTagIDList } from "./CTagIDList";
import { Tag } from "./MidTag";

export class VTags extends VPage<CTagIDList<any>> {
	private tags: Tag[] = [];

	header() {return 'tags'}
	content() {
		let {midTag} = this.controller;
		let {typeArr} = midTag;
		let left = <button className="btn btn-primary" 
			onClick={() => this.controller.showID(this.tags)}>
			查看
		</button>;
		let right = <>
			<button className="btn btn-sm btn-outline-primary mr-3" onClick={()=>this.allTags(true)}>全选</button>
			<button className="btn btn-sm btn-outline-info" onClick={()=>this.allTags(false)}>全清</button>
		</>;
		return <div className="px-3" id="$all$tags$">
			{typeArr.map(v => this.renderType(v))}
			<div className="border-top py-3">
				<LMR left={left} right={right} />
			</div>
		</div>;
	}

	private allTags = (selected:boolean) => {
		let el = document.getElementById('$all$tags$');
		let checkInputs = el.getElementsByTagName('input');
		for (let i=0; i<checkInputs.length; i++) {
			let checkInput = checkInputs[i];
			checkInput.checked = selected;
		}
	}

	private renderType(type: Tag) {
		let {id, name, sub}  = type;
		return <div key={id} className="my-3">
			<div><b>{name}</b></div>
			<div className="form-check form-check-inline mt-1">
			{sub.map(v => {
				let {id, name} = v;
				return <>
					<label key={id} className="form-check-label mr-3">
					<input type="checkbox" className="form-check-input"
						onChange={(evt) => this.onTagSelectChanged(evt, v)}
						 />
					{name}</label>
				</>
			})}
			</div>
		</div>
	}

	private onTagSelectChanged(evt: React.ChangeEvent<HTMLInputElement>, tag:Tag) {
		if (evt.currentTarget.checked === true) {
			this.tags.push(tag);
		}
		else {
			let index = this.tags.findIndex(v => v === tag);
			if (index >= 0) this.tags.splice(index, 1);
		}
	}
}
