import express, { Request, Response } from 'express';
import config from 'config';
import { getEndSegmentForUrlDataBase } from '../utils';

import {
	FIREBASE,
	END_POINT_SETTINGS_EDITORS,
	END_POINT_COLUMNS
} from '../core';

const routerSettingsEditors = express.Router({ mergeParams: true });

routerSettingsEditors.get('/', async(req: Request, res: Response) => {
	const { userId } = req.body;

	if (!userId) {
		res.status(400).send({
			settingsEditor: null,
			columns: null,
			slots: null
		});

		return;
	}

	const baseUrlSettingsEditors: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_SETTINGS_EDITORS);

	const baseUrlColumns: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_COLUMNS);

	if (config.get('nameDB') === FIREBASE) {
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

			return;
		}

		const responseColumns = await fetch(baseUrlColumns, {
			method: 'GET'
		});

		const dataColumns = await responseColumns.json();

		const arrayIdsColumns = Object.keys(dataColumns);

		const arrayColumnsResult = [];

		for (let m = 0; m < arrayIdsColumns.length; m++) {
			const idColumn = arrayIdsColumns[m];

			const columnData = dataColumns[idColumn];

			if (columnData.settingId === findSettings._id) {
				arrayColumnsResult.push(columnData);
			}
		}

		res.status(200).send({
			settingsEditor: findSettings,
			columns: arrayColumnsResult,
			slots: null // ДОДЕЛАТЬ ПОЛУЧЕНИЕ СЛОТОВ
		});

		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		settingsEditor: null,
		columns: null,
		slots: null
	});
});

export { routerSettingsEditors };
