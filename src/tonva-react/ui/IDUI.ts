import { ID, IDX } from "../uq";
import { FieldCustoms } from "./fieldItem";

interface IDUIBase {
	fieldCustoms?: FieldCustoms;
	t?: any;
}

export interface IDUI extends IDUIBase {
	ID: ID;
}

export interface IDXUI extends IDUIBase {
	ID: ID|IDX;
}
