import { makeObservable, observable, runInAction, toJS } from "mobx";
import { observer } from "mobx-react";
import { CSSProperties } from "react";
import { Bar } from "react-chartjs-2";
import { FA, LMR, NumberProp, Prop, VPage } from "tonva-react";
import { CIDX } from "./CIDX";

const spans = ['week', 'month'];

const graphOptions = {
	title: {
		display: false,
	},
	maintainAspectRatio: false,
}

export class VView extends VPage<CIDX> {
	currentIndex: number = 0;
	constructor(controller:CIDX) {
		super(controller);
		makeObservable(this, {
			currentIndex: observable,
		});
	}

	header() {return 'View'}
	right() {
		return <button
			className="btn btn-sm btn-primary mr-2" 
			onClick={() => this.controller.onItemEdit()}>
			<FA name="pencil-square-o" />
		</button>;
	}
	content() {		
		let V = observer(() => {
			let {spanValues, midIDX, timeSpan, prevTimeSpan, nextTimeSpan, dayValues} = this.controller;
			if (spanValues === null) return null; 
			let {props} = midIDX;
			const data = {
				labels: timeSpan.labels,
				datasets: [{
					label: '',
					data: toJS(dayValues),
					backgroundColor: 'lightgreen',
					borderWidth: 1
				}],
			};
			let curProp = props[this.currentIndex] as NumberProp;
			let {label, name} = curProp;
			let moveStep = (icon:string, spanStep: ()=>Promise<void>) => <div 
				className={'p-3 ' + (spanStep? 'cursor-pointer' : 'text-muted')} 
				onClick={spanStep}>
					<FA name={icon} />
				</div>;
			let left = moveStep('chevron-left', prevTimeSpan);
			let right = timeSpan.canNext === true?
				moveStep('chevron-right', nextTimeSpan)
				:
				moveStep('square-o', undefined);
				//<div><FA className="text-muted" name="square-o" /></div>;
			return <div className="py-3">
				<div className="container">
					<div className="row">
						{spans.map(v => {
							let cn = 'col text-center p-2 cursor-pointer ';
							let style:CSSProperties = {
								borderBottomWidth: '0.15rem',
								borderBottomStyle: 'solid',
							};
							if (timeSpan.type === v) {
								cn += 'text-primary font-weight-bold';
								style.borderBottomColor = 'blue';
							}
							else {
								cn += 'text-muted';
								style.borderBottomColor = 'lightgray';
							}
							return <div key={v} className={cn} style={style} 
								onClick={()=>this.tabClick(v as any)}>{this.t(v)}</div>;
						})}
					</div>
				</div>
				<LMR className="text-center align-items-center" left={left} right={right} >
					{timeSpan.title}
				</LMR>
				<div className="mt-3 mx-3 text-center cursor-pointer"
					onClick={() => this.onFieldHistory(name)}>
					<h4 className="d-inline">{label}</h4>
					<span className="text-info small"> <FA name="angle-double-right" /> 查看明细</span>
				</div>
				<div className="p-3 h-12c">
					<Bar data={data} width={100} height={50} options={graphOptions} />
				</div>
				<div className="d-flex flex-wrap p-1"> 
					{props.map((v, index) => {
						let {name, label} = v as any;
						let sv = spanValues[name];
						let val = sv?
							<b className="h3 mb-0">{sv}</b>
							:
							<small className="text-muted">0</small>
						let cn = 'm-1 w-8c h-8c d-flex flex-column align-items-center justify-content-center bg-white px-3 cursor-pointer border rounded ';
						cn += (index === this.currentIndex)? ' border-primary' : ' ';
						return <div key={index} className={cn} onClick={() => this.onFieldClick(v, index)}>
							<div className="my-3 h-4c d-flex align-items-center">{val}</div>
							<div className="mb-3">{label}</div>
						</div>
					})}
				</div>
			</div>;
		});
		return <V />;
	}

	private tabClick(span:'day'|'week'|'month'|'year') {
		this.controller.setTimeSpan(span);
	}

	private async onFieldClick(prop:Prop, index:number) {
		let {midIDX} = this.controller;
		let {props} = midIDX;
		if (this.currentIndex === index) {
			let curProp = props[this.currentIndex] as NumberProp;
			let {name} = curProp;
			await this.controller.showFieldHistory(name);
			return;
		}
		runInAction(() => {
			this.currentIndex = index;
			let curProp = props[this.currentIndex] as NumberProp;
			let {name} = curProp;
			this.controller.setCurrentField(name);
		});
	}

	private async onFieldHistory(field:string) {
		await this.controller.showFieldHistory(field);
	}
}
