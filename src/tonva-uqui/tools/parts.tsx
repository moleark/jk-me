import { FA } from "tonva-react";

export function listRight(onClick: () => any): JSX.Element {
	return <button className="btn btn-sm btn-success mr-2" onClick={onClick}>
		<FA name="plus" />
	</button>
}

export function renderItem(item:any, index:number) {
	return <>{JSON.stringify(item)}</>;
}

export function renderItemContainer(content:any) {
	return <div className="px-3 py-2">
		{content}
	</div>;
}
