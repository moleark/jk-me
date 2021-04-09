import { UqExt as Uq } from './JkMe';
import * as $Piecewise from './$Piecewise.ui';
import * as $PiecewiseDetail from './$PiecewiseDetail.ui';
import * as AccountType from './AccountType.ui';
import * as Account from './Account.ui';
import * as AccountCTO from './AccountCTO.ui';
import * as UserAccountType from './UserAccountType.ui';

export function setUI(uq: Uq) {
	Object.assign(uq.$Piecewise, $Piecewise);
	Object.assign(uq.$PiecewiseDetail, $PiecewiseDetail);
	Object.assign(uq.AccountType, AccountType);
	Object.assign(uq.Account, Account);
	Object.assign(uq.AccountCTO, AccountCTO);
	Object.assign(uq.UserAccountType, UserAccountType);
}
export * from './JkMe';
