import { observer } from "mobx-react";
import React from "react";
import { View } from "tonva-react";
import { CContentManager } from "./CContentManager";

export class VItem extends View<CContentManager> {
	render() {
		return React.createElement(observer(() => {
			return <div className="px-3 py-2">
				CContentManager is me {this.controller.value}
			</div>;
		}));
	}
}