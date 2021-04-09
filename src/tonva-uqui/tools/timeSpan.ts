import { env } from "tonva-react";

export abstract class TimeSpan {
	static create(span: 'day' | 'week' | 'month' | 'year'):TimeSpan {
		let ret:TimeSpan;
		switch (span) {
			case 'day': ret = new DaySpan(); break;
			case 'week': ret = new WeekSpan(); break;
			case 'month': ret = new MonthSpan(); break;
			case 'year': ret = new YearSpan(); break;
		}
		return ret;
	}
	protected firstNear: number;
	far: number;
	near: number;
	type: string;

	abstract prev():void;
	abstract next():void;
	abstract get title():string;
	abstract get labels():string[];
	protected abstract getDayArray(): Date[];

	get canNext():boolean {
		return this.near < this.firstNear;
	}
	get canPrev():boolean {return true;}

	getDayValues(dayValues:{t:string;v:number}[]): number[] {
		let days = this.getDayArray();
		let ret:number[] = [];
		let i = 0;
		let dv = dayValues[i++];
		for (let day of days) {
			if (dv) {
				let {t, v} = dv;
				let d = new Date(t);
				d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
				if (d.getTime() === day.getTime()) {
					ret.push(v);
					dv = dayValues[i++];
					continue;
				}
			}
			ret.push(0);
		}
		return ret;
	}
}

class DaySpan extends TimeSpan {
	private date: Date;
	private readonly _labels:string[] = [];
	constructor() {
		super();
		this.type = 'day';
		this.date = new Date();
		this.date.setHours(0, 0, 0, 0);
		this.far = this.date.getTime();
		this.firstNear = this.near = this.far + 24 * 3600 * 1000;
		for (let i=0; i<24; i++) this._labels.push(i + ':00');
	}
	prev():void {
		this.far -= 24 * 3600 * 1000;
		this.near -= 24 * 3600 * 1000;
	}
	next():void {
		this.far += 24 * 3600 * 1000;
		this.near += 24 * 3600 * 1000;
	}
	get title():string {
		return this.date.toLocaleDateString();
	}
	get labels():string[] {return this._labels}
	protected getDayArray(): Date[] {return [this.date]};
}


const enWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const zhWeek = ['一', '二', '三', '四', '五', '六', '日', ];
class WeekSpan extends TimeSpan {
	private firstDay: Date;
	private lastDay: Date;
	private readonly _labels:string[];
	constructor() {
		super();
		this.type = 'week';
		this.firstDay = new Date();
		this.firstDay.setHours(0, 0, 0, 0);
		let day = this.firstDay.getDay() || 7; // Get current day number, converting Sun. to 7
		if (day !== 1) {                // Only manipulate the date if it isn't Mon.
			this.firstDay.setHours(-24 * (day - 1));   // Set the hours to day number minus 1
		}
		this.far = this.firstDay.getTime();
		this.firstNear = this.near = this.far + 7 * 24 * 3600 * 1000;
		this.lastDay = new Date();
		this.lastDay.setDate(this.firstDay.getDate()+7);
		switch (env.lang) {
			default:
			case 'en': this._labels = enWeek; break;
			case 'zh': this._labels = zhWeek; break;
		}
	}
	prev():void {
		this.firstDay.setDate(this.firstDay.getDate()-7);
		this.lastDay.setDate(this.lastDay.getDate()-7);
		this.far -= 7 * 24 * 3600 * 1000;
		this.near -= 7 * 24 * 3600 * 1000;
	}
	next():void {
		this.firstDay.setDate(this.firstDay.getDate()+7);
		this.lastDay.setDate(this.lastDay.getDate()+7);
		this.far += 7 * 24 * 3600 * 1000;
		this.near += 7 * 24 * 3600 * 1000;
	}
	get title():string {
		return this.firstDay.toLocaleDateString();
	}
	get labels():string[] {return this._labels}
	protected getDayArray(): Date[] {
		let d = new Date(this.firstDay);
		let ret: Date[] = [this.firstDay];
		for (;;) {
			d.setDate(d.getDate() + 1);
			if (d >= this.lastDay) break;
			ret.push(new Date(d));
		}
		return ret;
	}
}

class MonthSpan extends TimeSpan {
	private firstDay: Date;
	private lastDay: Date;
	private _labels:string[];
	constructor() {
		super();
		this.type = 'month';
		let date = new Date();
		this.initFromDate(date);
		this.firstNear = this.near;
	}
	private initFromDate(date: Date) {
		let year = date.getFullYear(), month = date.getMonth();
		this.firstDay = new Date(year, month, 1);
		this.lastDay = new Date(year, month + 1, 0);
		this.far = this.firstDay.getTime();
		this.near = new Date(year, month+1, 1).getTime();
		this._labels = [];
		let count = this.lastDay.getDate();
		for (let i=1; i<=count; i++) this._labels.push(String(i));
	}
	prev():void {
		let date = new Date(this.firstDay.setMonth(this.firstDay.getMonth() - 1));
		this.initFromDate(date);
	}
	next():void {
		let date = new Date(this.firstDay.setMonth(this.firstDay.getMonth() + 1));
		this.initFromDate(date);
	}
	get title():string {
		return this.firstDay.toLocaleDateString();
	}
	get labels():string[] {return this._labels}
	protected getDayArray(): Date[] {
		let d = new Date(this.firstDay);
		let ret: Date[] = [this.firstDay];
		for (;;) {
			d.setDate(d.getDate() + 1);
			if (d >= this.lastDay) break;
			ret.push(new Date(d));
		}
		return ret;
	}
}

class YearSpan extends TimeSpan {
	private firstDay: Date;
	private lastDay: Date;
	private readonly _labels:string[] = [];
	constructor() {
		super();
		this.type = 'year';
		let date = new Date();
		this.initFromDate(date);
		this.firstNear = this.near;
		for (let i=0; i<=12; i++) this._labels.push(String(i));
	}
	private initFromDate(date: Date) {
		let year = date.getFullYear(), month = 0;
		this.firstDay = new Date(year, month, 1);
		this.lastDay = new Date(year, month + 1, 0);
		this.far = this.firstDay.getTime();
		this.near = new Date(year, month+1, 1).getTime();
	}
	prev():void {
		let date = new Date(this.firstDay.setMonth(this.firstDay.getMonth() - 1));
		this.initFromDate(date);
	}
	next():void {
		let date = new Date(this.firstDay.setMonth(this.firstDay.getMonth() + 1));
		this.initFromDate(date);
	}
	get title():string {
		return this.firstDay.toLocaleDateString();
	}
	get labels():string[] {return this._labels}
	protected getDayArray(): Date[] {
		let d = new Date(this.firstDay);
		let ret: Date[] = [this.firstDay];
		for (;;) {
			d.setDate(d.getDate() + 1);
			if (d >= this.lastDay) break;
			ret.push(new Date(d));
		}
		return ret;
	}
}
