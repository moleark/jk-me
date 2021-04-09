export function renderSelectItem(
	onChange:(evt:React.ChangeEvent<HTMLInputElement>)=>void, 
	content:any,
	defaultChecked:boolean):JSX.Element {
	return <label className="mx-3 my-2 d-flex mb-0">
		<input type="checkbox" onChange={onChange} className="mr-3" defaultChecked={defaultChecked} />
		{content}
	</label>;
}