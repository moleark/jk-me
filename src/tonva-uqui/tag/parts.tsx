import { observer } from "mobx-react";
import { FA } from "tonva-react";
import { IDBase } from "../base";
import { MidIDTagList, ItemTags } from "./CIDTagList";
import { Tag } from "./MidTag";

export function renderRight(onClick: () => void) {
	return <button className="btn btn-sm btn-primary mr-2" onClick={onClick}>
		<FA name="plus" />
	</button>;
}

export function renderItemTags<T extends IDBase>(midIDTagList: MidIDTagList<T>, itemTags:ItemTags<T>, index:number):JSX.Element {
	let V = observer(() => {
		let {midTag, renderItem, renderTags} = midIDTagList;
		//let {renderItem} = midTag;
		let {ID} = midTag;
		let {item, typeArr} = itemTags;
		return <div className="d-block">
			<div>{(renderItem ??  ID.render)(item as any, index)}</div>
			<div className="text-muted mt-1">{(renderTags ?? defaultRenderTags)(typeArr)}</div>
		</div>;	
	});
	return <V />;
}

function defaultRenderTags(typeArr:Tag[]):JSX.Element {
	return <>
		{
			typeArr.map(type => {
				let {id, name} = type;
				return <span key={id} className="mr-3">
					<b>{name}</b>: {renderType(type)}
				</span>;
			})
		}
	</>;
}

function renderType(type:Tag):JSX.Element {
	let V = observer(() => {
		let {sub} = type;
		return <>{sub.map(tag => {
			let {id, name} = tag;
			return <span className="mr-1" key={id}>{name}</span>
		})}</>;
	});
	return <V />;
}