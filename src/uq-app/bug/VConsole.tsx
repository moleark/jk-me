import { VPage } from "tonva-react";
import { CBug } from "./CBug";

export class VConsole extends VPage<CBug> {
	private div: HTMLDivElement;
	private divBottom: HTMLDivElement;
	init() {
		this.startAutoScrollToBottom();
	}
	header() {
		return this.controller.currentItem.name;
	}
	content() {
		let {currentItem} = this.controller;
		let {name, discription} = currentItem;
		return <div>
			<div className="p-3">
			<div><b>{name}</b></div>
			<div>{discription}</div>
			</div>
			<div ref={t => this.div = t} className="p-3 border-top border-primary bg-light" />
			<div ref={t => this.divBottom = t} />
		</div>;
	}

	private autoScrollEnd:boolean = false;
	private autoScroll = true;
    private lastScrollTop = 0;
    private timeHandler:any;
    private startAutoScrollToBottom() {
		if (this.autoScrollEnd === true) return;
		this.autoScroll = true;
		if (this.timeHandler !== undefined) return;
        this.timeHandler = setInterval(() => {
			if (this.autoScroll === false) return;
            this.divBottom?.scrollIntoView();
        }, 100);
    }
    private endAutoScrollToBottom() {
        setTimeout(() => {
			this.autoScroll = false;
			this.autoScrollEnd = true;
			if (this.timeHandler === undefined) return;
			clearInterval(this.timeHandler);
			this.timeHandler = undefined;
		}, 300);
	}
	private pauseAutoScrollToBottom() {
		this.autoScroll = false;
	}
	protected onPageScroll(e:any) {
        let el = e.target as HTMLBaseElement;
        let {scrollTop, scrollHeight, offsetHeight} = el;
        if (scrollTop <= this.lastScrollTop) {
            this.pauseAutoScrollToBottom();
        }
        else if (scrollTop + offsetHeight > scrollHeight - 30) {
            this.startAutoScrollToBottom();
        }

        this.lastScrollTop = scrollTop;
	}

	log = (message?: any):void => {
		const range = document.createRange();
		range.selectNode(this.div);
		let html:string;
		if (!message) {
			html = '<div>&nbsp;</div>';
		}
		else if (typeof message === 'object') {
			html = this.objToHtml(message);
		}
		else {
			html = '<div>' + message + '</div>';
		}
		const child = range.createContextualFragment(html);
		this.div.appendChild(child);
	}

	private objToHtml(obj: any) {
		if (obj === null) return '<div>null</div>';
		if (obj === undefined) return '<div>undefined</div>';
		if (Array.isArray(obj) === true) {
			return this.arrToHtml(0, obj);
		}
		let ret = '<div>{</div>';
		for (let i in obj) {
			ret += this.indent(1) + i + ': ';
			let v = obj[i];
			if (Array.isArray(v) === true) {
				ret += this.arrToHtml(1, v);
			}
			else {
				ret += this.objToString(v);
			}
		}
		ret += '<div>}</div>';
		return ret;
	}

	private indent(n:number) {
		if (!n) return '';
		let ret = '';
		n = n*2;
		for (let i=0; i<n; i++) ret += '&emsp;';
		return ret;
	}

	private objToString(obj: any) {
		if (obj === null) {
			return 'null';
		}
		if (Array.isArray(obj) === true) {
			return 'array[' + obj.length + ']';
		}
		switch (typeof obj) {
		default: return obj.toString();
		case 'undefined': return 'undefined';
		case 'object':
			if (obj.tuid === undefined) {
				return 'obj';
			}
			return obj.id;
		}
	}

	private objToLine(indent:number, obj:any) {
		let first = true;
		let ret = '<div>' + this.indent(indent) + '{ ';
		for (let i in obj) {
			if (first === false) {
				ret += ', ';
			}
			else {
				first = false;
			}
			ret += i + ':' + this.objToString(obj[i]);
		}
		ret += ' }</div>';
		return ret;
	}

	private indentVal(indent:number, val:any):string {
		return '<div>' + this.indent(indent) + val + '</div>'
	}
	private arrToHtml(indent:number, arr:any[]) {
		let ret = '<div>' + this.indent(indent) + '[</div>';
		for (let item of arr) {
			let t:string|number;
			switch (typeof item) {
				default: t = this.indentVal(indent+1, item); break;
				case 'object': t = this.objToLine(indent+1, item); break;
				case 'string': t = this.indentVal(indent+1, `'${item}'`); break;
			}
			ret += t;
		}
		ret += '<div>' + this.indent(indent) + ']</div>';
		return ret;
	}
}
