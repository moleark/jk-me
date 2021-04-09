//=== UqApp builder created on Fri Apr 09 2021 16:55:02 GMT-0400 (GMT-04:00) ===//
import * as JkMe from './JkMe';

export interface UQs {
	JkMe: JkMe.UqExt;
}

export * as JkMe from './JkMe';

export function setUI(uqs:UQs) {
	JkMe.setUI(uqs.JkMe);
}
