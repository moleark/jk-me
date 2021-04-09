//=== UqApp builder created on Wed Mar 10 2021 16:02:54 GMT-0500 (GMT-05:00) ===//
import * as BzHelloTonva from './BzHelloTonva';

export interface UQs {
	BzHelloTonva: BzHelloTonva.UqExt;
}

export * as BzHelloTonva from './BzHelloTonva';

export function setUI(uqs:UQs) {
	BzHelloTonva.setUI(uqs.BzHelloTonva);
}
