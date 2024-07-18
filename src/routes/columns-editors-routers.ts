import express, { Request, Response } from 'express';
import { getEndSegmentForUrlDataBase } from '../utils';
import config from 'config';

import {
	FIREBASE,
	END_POINT_COLUMNS_EDITORS
} from '../core';

const routerColumnsEditors = express.Router({ mergeParams: true });

routerColumnsEditors.post('/', async(req: Request, res: Response) => {
	const { settingId } = req.body;

	if (!settingId) {
		res.status(400).send({
			columnsEditor: null
		});

		return;
	}

	const baseUrlColumnsEditors: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_COLUMNS_EDITORS);

	if (config.get('nameDB') === FIREBASE) {
		const responseColumnsEditors = await fetch(baseUrlColumnsEditors, {
			method: 'GET'
		});

		const dataColumnsEditors = await responseColumnsEditors.json();

		const arrayIdsColumnsEditors = Object.keys(dataColumnsEditors);

		let arrayColumns = [];

		for (let m = 0; m < arrayIdsColumnsEditors.length; m++) {
			const idColumnEditor = arrayIdsColumnsEditors[m];

			const columnForEditor = dataColumnsEditors[idColumnEditor];

			if (columnForEditor.settingId === settingId) {
				arrayColumns.push(columnForEditor);
			}
		}

		res.status(200).send({
			columnsEditor: arrayColumns
		});

		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		columnsEditor: null
	});
});

export { routerColumnsEditors };
