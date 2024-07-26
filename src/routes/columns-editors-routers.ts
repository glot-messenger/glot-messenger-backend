import express, { Request, Response } from 'express';
import { getEndSegmentForUrlDataBase } from '../utils';
import config from 'config';
import { modelColumn } from '../models';

import {
	FIREBASE,
	MONGO_DB,
	END_POINT_COLUMNS_EDITORS
} from '../core';

const routerColumnsEditors = express.Router({ mergeParams: true });

routerColumnsEditors.post('/', async(req: Request, res: Response) => {
	const { settingId, columns } = req.body;

	if (!settingId) {
		res.status(400).send({
			columnsEditor: null
		});

		return;
	}

	if (config.get('nameDB') === FIREBASE) {
		const baseUrlColumnsEditors: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_COLUMNS_EDITORS);

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

	if (config.get('nameDB') === MONGO_DB) {
		try {
			const columnsData = await modelColumn.find({ settingId });

			const resultColumns = [];

			for (const columnId of columns) {
				const columnDataTarget = columnsData.find((valueColumn) => (valueColumn._id.toString() === columnId));

				if (columnDataTarget) {
					resultColumns.push(columnDataTarget);
				}
			}

			res.status(200).send({
				columnsEditor: resultColumns
			});

		} catch (err: any) {
			console.log('Error when getting the editor columns...');

			console.log(`Error: ${err}.`);

			res.status(500).send({
				columnsEditor: null
			});
		}

		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		columnsEditor: null
	});
});

export { routerColumnsEditors };
