import express, { Request, Response } from 'express';
import { getEndSegmentForUrlDataBase } from '../utils';
import config from 'config';
import { ColumnModel } from '../lib';

import {
	FIREBASE,
	END_POINT_COLUMNS_EDITORS
} from '../core';

const routerColumnColumnsEditors = express.Router({ mergeParams: true });

routerColumnColumnsEditors.post('/', async(req: Request, res: Response) => {
	const { settingId, data } = req.body;

	if (!settingId) {
		res.status(400).send({
			newColumnInEditor: null
		});

		return;
	}

	let dataNewColumn = data;

	if (!dataNewColumn) {
		dataNewColumn = new ColumnModel({ settingId });
	}

	const baseUrlColumnColumnsEditors: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_COLUMNS_EDITORS + `/${dataNewColumn._id}`);

	if (config.get('nameDB') === FIREBASE) {
		const responseColumnColumnsEditors = await fetch(baseUrlColumnColumnsEditors, {
			method: 'PUT',
			body: JSON.stringify(dataNewColumn)
		});

		const dataColumnColumnsEditors = await responseColumnColumnsEditors.json();

		// firebase в данный момент не создает ключ, если в нем пустое значение slots нет, посмотреть что можно сделать
		// добавить колонку в массив настроек редактора и вернуть правильно значение клиенту
		console.log('1111', dataColumnColumnsEditors);

		res.status(404).send({
			newColumnInEditor: null
		});

		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		newColumnInEditor: null
	});
});

export { routerColumnColumnsEditors };