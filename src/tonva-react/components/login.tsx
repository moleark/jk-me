import { User } from '../tool';

export interface Login {
	showLogin(callback?: (user:User)=>Promise<void>, withBack?:boolean):void;
	showLogout(callback?: ()=>Promise<void>):void
	//showRegister():void
	//showForget():void
	showChangePassword():void
}

export async function createLogin():Promise<Login> {
	let importCLogin = await import('../auth/CLogin');
	return new importCLogin.CLogin();
}

export async function showRegister():Promise<void> {
	let importCRegister = await import('../auth/register/CRegister');
	let c = new importCRegister.CRegister();
	c.start();
}

export async function showForget():Promise<void> {
	let importCRegister = await import('../auth/register/CRegister');
	let c = new importCRegister.CForget();
	c.start();
}
