import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { FA, left0, LMR, NumberProp, StringProp, VPage } from "tonva-react";
import { CIDX } from "./CIDX";

export class VEdit extends VPage<CIDX> {
	header() {return 'Edit'}
	content() {
		let {midIDX} = this.controller;
		let {props} = midIDX;
		return <div className="py-3">
			{props.map((v, index) => {
				let {type} = v as any;
				switch (type) {
					default: return null;
					case 'string': 
						return this.renderStringProp(v as StringProp);
					case 'integer':
					case 'number': 
						return this.renderNumberProp(v as NumberProp);
				}
			})}
		</div>
	}

	private renderStringProp(prop:StringProp) {
		return <div key={prop.name} className="px-3 py-2 bg-white mb-1 cursor-pointer">
			{JSON.stringify(prop)}
		</div>;
	}

	private renderNumberProp(prop: NumberProp) {
		let V = observer(() => {
			let {name} = prop;
			let {spanValues} = this.controller;
			if (!spanValues) return null;
			return <div key={name} className="px-3 py-2 bg-white mb-1 cursor-pointer" 
				onClick={()=>this.openVPage(VEditNumberField, prop)}>
				<LMR left={<b>{prop.label}</b>} 
					right={<FA name="pencil-square-o" className="align-self-center" />}>
					<div className="mr-5 text-right">{this.controller.spanValues[name]}</div>
				</LMR>
			</div>;
		});
		return <V />;
	}
}

class VEditNumberField extends VPage<CIDX> {
	private prop: NumberProp;
	private date: Date;
	private value: number;
	private dateInput: HTMLInputElement;
	private timeInput: HTMLInputElement;
	disabled: boolean = true;
	constructor(controller: CIDX) {
		super(controller);
		makeObservable(this, {
			disabled: observable
		});
	}
	init(prop: NumberProp) {
		this.prop = prop;
		this.date = new Date();
	}
	header() {return this.prop.label}
	right() {
		let V = observer(() => <button 
			className="btn btn-sm btn-success mr-2" 
			disabled={this.disabled}
			onClick={this.onSave}>
			{this.t('submit')}
		</button>);
		return <V />;
	}
	content() {
		let {time} = this.prop;
		let year = this.date.getFullYear();
		let month = this.date.getMonth() + 1;
		let day = this.date.getDate();
		let hour = this.date.getHours();
		let minute = this.date.getMinutes();
		let defDate = `${year}-${left0(month, 2)}-${left0(day, 2)}`;
		let vDateTime:any;
		if (time === true) {
			vDateTime = <div className="input-group mb-3">
				<span className="w-8c input-group-text">{this.t('date')}</span>
				<input ref={d => this.dateInput=d} type="date" 
					className="form-control" defaultValue={defDate} />
				<input ref={t => this.timeInput=t} type="time" className="form-control" 
					defaultValue={`${left0(hour, 2)}:${left0(minute, 2)}`} />
			</div>;
		}
		return <div className="p-3">
			{vDateTime}
			<div className="input-group">
				<span className="w-8c input-group-text">{this.t('value')}</span>
				<input type="number" className="form-control" 
					onChange={this.onValueChange} />
			</div>
		</div>;
	}

	private onValueChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		let v = evt.currentTarget.value.trim();
		this.disabled = v.length === 0;
		let n = Number(v);
		if (Number.isNaN(n) === false) this.value = n;
	}

	private onSave = async () => {
		let t: number;
		if (this.dateInput) {
			let date = this.dateInput.valueAsDate;
			let dateTicks = this.dateInput?.valueAsNumber;
			let timeTicks = this.timeInput?.valueAsNumber;
			t = dateTicks + timeTicks + date.getTimezoneOffset()*60*1000;
		}
		else {
			t = Date.now();
		}
		await this.controller.saveFieldValue(this.prop.name, t, this.value);
		this.closePage();
	}
}
