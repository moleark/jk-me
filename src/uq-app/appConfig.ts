//=== UqApp builder created on Tue Jan 12 2021 23:14:51 GMT-0500 (GMT-05:00) ===//
import { AppConfig, DevConfig } from "tonva-react";

const bz: DevConfig = {
	name: 'bizdev',
	alias: 'bz',
}

export const appConfig: AppConfig = {
	version: '0.1.0',
	app: undefined,
	uqs: [
		{
			dev: bz,
			name: 'hello-tonva',
			alias: 'HelloTonva',
			version: '0.1.0',
		},
	],
	noUnit: true,
    tvs: {},
	oem: undefined,
	htmlTitle: 'hello-tonva',
};
