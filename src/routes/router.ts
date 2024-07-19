import express from 'express';
import { routerSettingsEditors } from './settings-editors-routers';
import { routerColumnsEditors } from './columns-editors-routers';
import { routerSlotsEditors } from './slots-editors-routers';

import {
	END_POINT_SETTINGS_EDITORS,
	END_POINT_COLUMNS_EDITORS,
	END_POINT_SLOTS_EDITORS
} from '../core';

const routerChild = express.Router({ mergeParams: true });

// Без проверки авторизации ==================================================================================
routerChild.use(END_POINT_SETTINGS_EDITORS, routerSettingsEditors);
routerChild.use(END_POINT_COLUMNS_EDITORS, routerColumnsEditors);
routerChild.use(END_POINT_SLOTS_EDITORS, routerSlotsEditors);

export { routerChild };
