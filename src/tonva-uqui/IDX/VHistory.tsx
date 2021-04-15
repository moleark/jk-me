// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VPage, List, LMR, EasyTime, UserView, User, View } from "tonva-react";
import { CIDX } from "./CIDX";

export class VHistory extends View<CIDX> {
	render() {
		return <div>
			<List items={this.controller.historyItems} item={{render: this.renderItem, key:(item)=>item.t}} />
		</div>
	}

	private renderItem = (item:any, index:number) => {
		let {t, v, u} = item;
		let left = <div className="w-12c"><EasyTime date={new Date(t)} /></div>;
		let renderUser = (user:User) => {
			let {name, nick} = user;
			return <small className="text-muted">{nick || name}</small>
		}
		let right = <UserView user={u} render={renderUser} />;
		return <div className="px-3 py-2">			
			<LMR className="w-100" left={left} right={right}>{v}</LMR>
		</div>
	}
}

export class VHistoryPage extends VPage<CIDX> {
	header() {return this.controller.field}
	content() {
		return this.renderVm(VHistory);
	}

}
