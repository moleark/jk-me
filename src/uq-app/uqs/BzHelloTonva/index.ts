import { UqExt as Uq } from './BzHelloTonva';
import * as Customer from './Customer.ui';
import * as OrderMaster from './OrderMaster.ui';
import * as OrderDetail from './OrderDetail.ui';
import * as Tag from './Tag.ui';
import * as Staff from './Staff.ui';
import * as $Piecewise from './$Piecewise.ui';
import * as $PiecewiseDetail from './$PiecewiseDetail.ui';
import * as Achieve from './Achieve.ui';
import * as Hours from './Hours.ui';
import * as CustomerTag from './CustomerTag.ui';
import * as UserStaff from './UserStaff.ui';

export function setUI(uq: Uq) {
	Object.assign(uq.Customer, Customer);
	Object.assign(uq.OrderMaster, OrderMaster);
	Object.assign(uq.OrderDetail, OrderDetail);
	Object.assign(uq.Tag, Tag);
	Object.assign(uq.Staff, Staff);
	Object.assign(uq.$Piecewise, $Piecewise);
	Object.assign(uq.$PiecewiseDetail, $PiecewiseDetail);
	Object.assign(uq.Achieve, Achieve);
	Object.assign(uq.Hours, Hours);
	Object.assign(uq.CustomerTag, CustomerTag);
	Object.assign(uq.UserStaff, UserStaff);
}
export * from './BzHelloTonva';
