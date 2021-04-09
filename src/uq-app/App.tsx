//=== UqApp builder created on Wed Mar 10 2021 16:02:48 GMT-0500 (GMT-05:00) ===//
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

