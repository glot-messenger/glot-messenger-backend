import express from 'express';
import { routerSettingsEditors } from './settings-editors-routers';
import { routerColumnsEditors } from './columns-editors-routers';
import { routerSlotsEditors } from './slots-editors-routers';
import { routerColumnColumnsEditors } from './column-columns-editors-routers';
import { routerMovingColumnColumnsEditors } from './moving-column-columns-editors-routers';
import { routerSlotSlotsEditors } from './slot-slots-editors-routers';
import { routerMovingSlotSlotsEditors } from './moving-slot-slots-editors-routers';
import { routerWhatsNew } from './whats-new-routers';

import {
	END_POINT_SETTINGS_EDITORS,
	END_POINT_COLUMNS_EDITORS,
	END_POINT_SLOTS_EDITORS,
	END_POINT_COLUMN_COLUMNS_EDITORS,
	END_POINT_MOVING_COLUMN_COLUMNS_EDITORS,
	END_POINT_SLOT_SLOTS_EDITORS,
	END_POINT_MOVING_SLOT_SLOTS_EDITORS,
	END_POINT_WHATS_NEW
} from '../core';

const routerChild = express.Router({ mergeParams: true });

// С проверкой авторизации ===================================================================================

// Без проверки авторизации ==================================================================================
routerChild.use(END_POINT_SETTINGS_EDITORS, routerSettingsEditors);
routerChild.use(END_POINT_COLUMNS_EDITORS, routerColumnsEditors);
routerChild.use(END_POINT_SLOTS_EDITORS, routerSlotsEditors);
routerChild.use(END_POINT_COLUMN_COLUMNS_EDITORS, routerColumnColumnsEditors);
routerChild.use(END_POINT_MOVING_COLUMN_COLUMNS_EDITORS, routerMovingColumnColumnsEditors);
routerChild.use(END_POINT_SLOT_SLOTS_EDITORS, routerSlotSlotsEditors);
routerChild.use(END_POINT_MOVING_SLOT_SLOTS_EDITORS, routerMovingSlotSlotsEditors);
routerChild.use(END_POINT_WHATS_NEW, routerWhatsNew);

export { routerChild };
