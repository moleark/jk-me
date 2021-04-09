import { AppConfig, CAppBase } from './CAppBase';
import { nav } from '../components';

export async function startPage(CApp: new (config: AppConfig) => CAppBase<any>, appConfig: AppConfig) {
	nav.setSettings(appConfig);

	let cApp = new CApp(appConfig);
	cApp.init();
    await cApp.start();
}
