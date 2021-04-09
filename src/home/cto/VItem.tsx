import { observer } from "mobx-react";
import React from "react";
import { View } from "tonva-react";
import { CCTO } from "./CCTO";

export class VItem extends View<CCTO> {
	render() {
		return React.createElement(observer(() => {
			return <div className="px-3 py-2">
				CTO is me {this.controller.value}
			</div>;
		}));
	}
}