import { buildTsHeader } from "./tools";

export function buildTsApp():string {
	return `${buildTsHeader()}
import { NavView, start, nav } from 'tonva-react';
import { CApp } from './CApp';
import { appConfig } from './appConfig';

export const App: React.FC = () => {
	nav.setSettings(appConfig);
	const onLogined = async (isUserLogin?:boolean) => {
		await start(CApp, appConfig, isUserLogin);
	}
	return <NavView onLogined={onLogined} />;
}

`;
}
