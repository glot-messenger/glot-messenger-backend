import express, { Request, Response } from 'express';
import config from 'config';
import { getEndSegmentForUrlDataBase } from '../utils';

import {
	FIREBASE,
	MONGO_DB,
	END_POINT_SETTINGS_EDITORS
} from '../core';

const routerSettingsEditors = express.Router({ mergeParams: true });

routerSettingsEditors.post('/', async(req: Request, res: Response) => {
	const { userId } = req.body;

	if (!userId) {
		res.status(400).send({
			settingsEditor: null
		});

		return;
	}

	//const baseUrlColumns: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_COLUMNS);

	//const baseUrlSlots: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_SLOTS);

	if (config.get('nameDB') === FIREBASE) {
		const baseUrlSettingsEditors: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_SETTINGS_EDITORS);

		const responseSettingsEditors = await fetch(baseUrlSettingsEditors, {
			method: 'GET'
		});

		const dataSettingsEditors = await responseSettingsEditors.json();

		const arrayIdsSettingsEditors = Object.keys(dataSettingsEditors);

		let findSettings = null;

		for (let m = 0; m < arrayIdsSettingsEditors.length; m++) {
			const idSettingsEditor = arrayIdsSettingsEditors[m];

			const settingsForEditor = dataSettingsEditors[idSettingsEditor];

			if (settingsForEditor.userId === userId) {
				findSettings = settingsForEditor;

				break;
			}
		}

		if (findSettings === null) {
			// ТУТ НАДО СОЗДАТЬ ГЕНЕРАЦИЮ НАСТРОЕК ПРОФИЛЯ ПО ДЕФОЛТУ И ИХ ЗАПИСЬ В БАЗУ FIREBASE
			// ЭТО НА СЛУЧАЙ, ЕСЛИ ПОЛЬЗОВАТЕЛЬ ВПЕРВЫЕ ЗАРЕГЕСТРИРОВАН И ЕМУ НАДО СОЗДАТЬ НАСТРОЙКИ ПРОСТРАНСТВА

			return;
		}

		//const responseColumns = await fetch(baseUrlColumns, {
		//	method: 'GET'
		//});

		//const dataColumns = await responseColumns.json();

		//const arrayIdsColumns = Object.keys(dataColumns);

		//const arrayColumnsResult = [];

		//for (let m = 0; m < arrayIdsColumns.length; m++) {
		//	const idColumn = arrayIdsColumns[m];

		//	const columnData = dataColumns[idColumn];

		//	if (columnData.settingId === findSettings._id) {
		//		arrayColumnsResult.push(columnData);
		//	}
		//}

		//const responseSlots = await fetch(baseUrlSlots, {
		//	method: 'GET'
		//});

		//const dataSlots = await responseSlots.json();

		//const arrayIdsSlots = Object.keys(dataSlots);

		//const storeSlots: Record<string, Array<any>> = {};

		//for (let m = 0; m < arrayIdsSlots.length; m++) {
		//	const idSlot = arrayIdsSlots[m];

		//	const slotData = dataSlots[idSlot];

		//	if (!storeSlots.hasOwnProperty(slotData.columnId)) {
		//		storeSlots[slotData.columnId] = [];
		//	}

		//	storeSlots[slotData.columnId].push(slotData);
		//}

		res.status(200).send({
			settingsEditor: findSettings
		});

		return;
	}

	if (config.get('nameDB') === MONGO_DB) {


		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		settingsEditor: null
	});
});

export { routerSettingsEditors };
